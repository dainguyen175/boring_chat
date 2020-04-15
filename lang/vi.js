export const transValidation = {
  email_incorrect : "Email phải có dạng example@gmail.com!!",
  gender_incorrect : "Ủa, sao lại sai giới tính vậy T_T",
  password_incorrect : "Mật khẩu phải chứ ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và chữ số. ",
  password_confirmation_incorrect : "Nhập lại mật khẩu chưa chính xác.",
  update_username: "Username giới hạn trong khoảng 3-17 ký tự và không được phép chứa ký tự đặc biệt. ",
  update_gender: "Oops! Dữ liệu giới tính có vấn đề, bạn là hacker chăng? ",
  update_address: " Địa chỉ giới hạn trong khoảng 3-30 ký tự. ",
  update_phone: "Số điện thoại Việt Nam bắt đầu bằng số 0, giới hạn trong khoảng 10-11 ký tự.",
  keyword_find_user: "Lỗi từ khoá tìm kiếm, chi cho phép ký tự chữ cái và số, cho phép khoảng trống.",
  message_text_emoji_incorrect: "Tin nhắn không hợp lệ, đảm bảo tối thiểu một ký tự, tối đa 400 ký tự."
};

export const transErrors = {
  account_in_use : "Email này đã được sử dụng.",
  account_removed: "Tài khoản này đã bị gỡ khỏi hệ thống, nếu tin rằng điều này là hiểu nhầm, vui lòng liện hệ với hỗ trợ của chúng tôi. ",
  account_not_active: "Email này đã được đăng ký nhưng chưa active tài khoản, vui lòng kiểu tra email của bạn hoặc liên hệ với bộ phận hỗ trợ của chúng tôi. ",
  account_undefined: "Tài khoản này không tồn tại.",
  token_undefined: "Token không tồn tại!",
  login_failed: "Sai tài khoản hoặc mật khẩu.",
  server_error: "Có lỗi trong quá trình đăng nhập, vui lòng liên hệ với bộ phận của chúng tôi. Xin cảm ơn. ",
  avatar_type: "Kiểu file không hợp lệ, chỉ chấp nhận jpg & png.",
  avatar_size: "Ảnh upload cho phép tối đa 1MB. ",
  user_current_password_failed: "Mật khẩu hiện tại không chính xác.",
  conversation_not_found: "Cuộc trò chuyện không tồn tại.",
  image_message_type: "Kiểu file không hợp lệ, chỉ chấp nhận jpg & png.",
  image_chat_size: "Ảnh upload cho phép tối đa 1MB. ",
};

export const transSuccess = {
  userCreated: (userEmail) =>{
    return `Tài khoản <strong>${userEmail}</strong> đã được tạo, vui lòng kiểm tra email của bạn để active tài khoản trước khi đăng nhập. `;
  },
  account_actived: "Kích hoạt tài khoản thành công, bạn đã có thể đăng nhập vào ứng dụng.",
  loginSuccess: (username) => {
    return `Xin chào ${username}, chúc bạn một ngày tốt lành.`;
  },
  logout_success: "Đăng xuất tài khoản thành công, hẹn gặp lại bạn. ",
  user_info_updated: "Cập nhật thông tin người dùng thành công.",
  user_password_updated: "Cập nhật mật khẩu thành công.",
};

export const transMail = {
  subject: "Boring Chat: Xác nhận kích hoạt tài khoản",
  template: (linkVerify) =>{
    return `
      <h2>Bạn nhận được email này vì đã đăng ký tài khoản trên ứng dụng Boring Chat. </h2>
      <h3>Vui lòng click vào link bên dưới để xác nhận kích hoạt tài khoản. </h3>
      <h3><a href="${linkVerify}" target="blank">${linkVerify}</h3>
      <h4>Nếu tin rằng email này là nhầm lẫn, hãy bỏ qua nó. Trân trọng. </h4>
    `;
  },
  send_failed:"Có lỗi trong quá trình gửi email, vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi."
};
