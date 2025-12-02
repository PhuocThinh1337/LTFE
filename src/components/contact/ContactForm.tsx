import React, { useState, FormEvent, ChangeEvent } from 'react';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  subject: string;
  message: string;
  captcha: string;
}

interface CaptchaAnswer {
  num1: number;
  num2: number;
  answer: number;
}

function ContactForm(): React.JSX.Element {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    subject: '',
    message: '',
    captcha: ''
  });

  const [captchaValue, setCaptchaValue] = useState<string>('');
  const [captchaAnswer] = useState<CaptchaAnswer>(() => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    return { num1, num2, answer: num1 + num2 };
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    
    // Validate CAPTCHA
    if (parseInt(captchaValue) !== captchaAnswer.answer) {
      alert('Câu trả lời CAPTCHA không đúng. Vui lòng thử lại.');
      return;
    }

    // Tạm thời chỉ log ra console, bạn có thể nối API backend sau
    console.log('Submitted contact form:', formData);
    alert('Cảm ơn bạn đã liên hệ Nippon Paint! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.');
    
    // Reset form
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      address: '',
      subject: '',
      message: '',
      captcha: ''
    });
    setCaptchaValue('');
  };

  return (
    <div className="np-contact-form-wrapper" data-aos="fade-left">
      <h2>ĐĂNG KÝ THÔNG TIN</h2>
      <p className="np-form-intro">
        Bạn muốn trở thành đại lý chính thức của sơn Nippon hay cần tư vấn về sản phẩm, màu sắc?
        Liên hệ ngay với chúng tôi để được hỗ trợ kịp thời nhé!
      </p>
      
      <form className="np-contact-form" onSubmit={handleSubmit}>
        <div className="np-form-field">
          <label htmlFor="fullName">
            Họ và tên <span>*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            required
            placeholder="Nhập họ và tên của bạn"
          />
        </div>

        <div className="np-form-field">
          <label htmlFor="email">
            Email <span>*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="example@email.com"
          />
        </div>

        <div className="np-form-field">
          <label htmlFor="phone">
            Số điện thoại <span>*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="0900 000 000"
          />
        </div>

        <div className="np-form-field">
          <label htmlFor="address">Địa chỉ</label>
          <input
            id="address"
            name="address"
            type="text"
            value={formData.address}
            onChange={handleChange}
            placeholder="Nhập địa chỉ của bạn"
          />
        </div>

        <div className="np-form-field">
          <label htmlFor="subject">
            Tiêu đề <span>*</span>
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            value={formData.subject}
            onChange={handleChange}
            required
            placeholder="Nhập tiêu đề yêu cầu"
          />
        </div>

        <div className="np-form-field">
          <label htmlFor="message">
            Nội dung <span>*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="Nhập nội dung yêu cầu của bạn..."
          />
        </div>

        <div className="np-form-field np-captcha-field">
          <label htmlFor="captcha">
            CAPTCHA <span>*</span>
          </label>
          <div className="np-captcha-wrapper">
            <div className="np-captcha-question">
              <span>
                {captchaAnswer.num1} + {captchaAnswer.num2} = ?
              </span>
              <small>Câu hỏi này dùng để kiểm tra xem bạn là người hay là chương trình tự động.</small>
            </div>
            <input
              id="captcha"
              name="captcha"
              type="number"
              value={captchaValue}
              onChange={(e) => setCaptchaValue(e.target.value)}
              required
              placeholder="Nhập kết quả"
              className="np-captcha-input"
            />
          </div>
        </div>

        <div className="np-form-footer">
          <button type="submit" className="np-btn-primary np-btn-submit">
            Gửi
          </button>
        </div>
      </form>
    </div>
  );
}

export default ContactForm;

