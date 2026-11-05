type FieldName = 'loginId' | 'password' | 'passwordConfirm' | 'nickname';
export type FormErrors = Partial<Record<FieldName | 'form', string>>;

// P-ACC-03
export function validateNickname(nickname: string) {
  return /^[가-힣a-zA-Z0-9]{2,12}$/.test(nickname)
    ? undefined
    : '닉네임은 2~12자 한글·영문·숫자예요.';
}

export function validateLogin({ loginId, password }: { loginId: string; password: string }) {
  const errors: FormErrors = {};
  if (!loginId) errors.loginId = '아이디를 입력해 주세요.';
  if (!password) errors.password = '비밀번호를 입력해 주세요.';
  return errors;
}

// P-ACC-02, P-ACC-03. 비밀번호 최대 길이는 BE의 SignupRequest를 따른다.
export function validateSignup(form: {
  loginId: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
}) {
  const errors: FormErrors = {};
  if (!/^[a-z0-9]{4,20}$/.test(form.loginId)) {
    errors.loginId = '아이디는 4~20자 영문 소문자·숫자예요.';
  }
  if (form.password.length < 8 || form.password.length > 64) {
    errors.password = '비밀번호는 8~64자로 입력해 주세요.';
  }
  if (form.password !== form.passwordConfirm) {
    errors.passwordConfirm = '비밀번호가 일치하지 않아요.';
  }
  const nickname = validateNickname(form.nickname);
  if (nickname) errors.nickname = nickname;
  return errors;
}

const FIELD_BY_CODE: Record<string, FieldName> = {
  LOGIN_ID_TAKEN: 'loginId',
  NICKNAME_TAKEN: 'nickname',
  INVALID_CREDENTIALS: 'password',
};

const FIELDS = ['loginId', 'password', 'passwordConfirm', 'nickname'];

// ApiError를 입력 칸별 메시지로 바꾼다. code가 없으면 네트워크 오류다.
export function toFormErrors(error: unknown): FormErrors {
  const { code, message } = error as { code?: string; message?: string };
  if (!code || !message) return { form: '서버에 연결하지 못했어요. 잠시 후 다시 시도해 주세요.' };

  const field = FIELD_BY_CODE[code];
  if (field) return { [field]: message };

  if (code === 'VALIDATION_FAILED') {
    // BE 형식: `필드: 내용`
    const separator = message.indexOf(': ');
    const name = message.slice(0, separator);
    if (separator > 0 && FIELDS.includes(name)) {
      return { [name]: message.slice(separator + 2) };
    }
  }
  return { form: message };
}

const GITHUB_ERRORS: Record<string, string> = {
  GITHUB_CANCELLED: 'GitHub 로그인을 취소했어요.',
  GITHUB_ALREADY_LINKED: '다른 계정에 연결된 GitHub예요.',
  GITHUB_CODE_INVALID: 'GitHub 로그인 시간이 지났어요. 다시 시도해 주세요.',
};

// 주소로 전달받은 코드라서 서버 메시지 대신 앱에 있는 문구만 보여준다.
export function githubErrorMessage(code: string) {
  return GITHUB_ERRORS[code] ?? 'GitHub 로그인에 실패했어요. 다시 시도해 주세요.';
}
