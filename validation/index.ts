export const loginValid = (data: {
    email: string,
    password: string,
}) => {
    const error: {
        email: string,
        password: string,
    } = {
        email: '',
        password: '',
    }

    if (!data.email) {
        error.email = 'Vui lòng nhập email'
    } else if (!data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        error.email = 'Email không hợp lệ'
    }

    if (!data.password) {
        error.password = 'Vui lòng nhập mật khẩu'
    } else if (data.password.length < 7) {
        error.password = 'Mật khẩu phải chứa ít nhất 8 ký tự'
    }

    return error;
}

export const signupValid = (data: {
    username: string,
    email: string,
    password: string,
    phoneNumber: number | null,
    address: string,
}) => {
    const error: {
        username: string,
        email: string,
        password: string,
        phoneNumber: string,
        address: string,
    } = {
        username: '',
        email: '',
        password: '',
        phoneNumber: '',
        address: '',
    }

    if (!data.username) {
        error.username = 'Vui lòng nhập tên đăng nhập'
    } else if (data.username.length < 5) {
        error.username = 'Tên đăng nhập phải chứa ít nhất 6 ký tự'
    }

    if (!data.email) {
        error.email = 'Vui lòng nhập email'
    } else if (!data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        error.email = 'Email không hợp lệ'
    }

    if (!data.password) {
        error.password = 'Vui lòng nhập mật khẩu'
    } else if (data.password.length < 7) {
        error.password = 'Mật khẩu phải chứa ít nhất 8 ký tự'
    }

    if (!data.phoneNumber) {
        error.phoneNumber = 'Vui lòng nhập số điện thoại'
    } else if (isNaN(data.phoneNumber) || data.phoneNumber.toString().length!== 9) {
        error.phoneNumber = 'Số điện thoại phải là số và chứa 10 chữ số'
    }

    if (!data.address) {
        error.address = 'Vui lòng nhập địa chỉ'
    }

    return error;
}