import React, { useState, FormEvent, ChangeEvent, useRef } from 'react';

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
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

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
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ và tên';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9\s\-+()]+$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Vui lòng nhập tiêu đề';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Vui lòng nhập nội dung';
    }

    if (!captchaValue) {
      newErrors.captcha = 'Vui lòng nhập kết quả CAPTCHA';
    } else if (parseInt(captchaValue) !== captchaAnswer.answer) {
      newErrors.captcha = 'Câu trả lời không đúng';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = formRef.current?.querySelector('[data-error="true"]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Tạm thời chỉ log ra console, bạn có thể nối API backend sau
    console.log('Submitted contact form:', formData);
    
    setIsSubmitting(false);
    setSubmitSuccess(true);

    // Reset form after success
    setTimeout(() => {
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
      setSubmitSuccess(false);
    }, 3000);
  };

  return (
    <div className="np-contact-form-wrapper" data-aos="fade-left">
      <h2 className="np-form-title">
        <span className="np-form-title-icon">📝</span>
        ĐĂNG KÝ THÔNG TIN
      </h2>
      <p className="np-form-intro">
        Bạn muốn trở thành đại lý chính thức của sơn Nippon hay cần tư vấn về sản phẩm, màu sắc?
        Liên hệ ngay với chúng tôi để được hỗ trợ kịp thời nhé!
      </p>
      
      {submitSuccess && (
        <div className="np-form-success">
          <div className="np-success-icon">✓</div>
          <p>Cảm ơn bạn đã liên hệ Nippon Paint! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.</p>
        </div>
      )}

      <form ref={formRef} className="np-contact-form" onSubmit={handleSubmit} noValidate>
        <div className={`np-form-field ${formData.fullName ? 'np-field-filled' : ''} ${errors.fullName ? 'np-field-error' : ''}`}>
          <label htmlFor="fullName">
            Họ và tên <span className="np-required">*</span>
          </label>
          <div className="np-input-wrapper">
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder=" "
              data-error={errors.fullName ? 'true' : 'false'}
            />
            <span className="np-input-border"></span>
          </div>
          {errors.fullName && <span className="np-error-message">{errors.fullName}</span>}
        </div>

        <div className={`np-form-field ${formData.email ? 'np-field-filled' : ''} ${errors.email ? 'np-field-error' : ''}`}>
          <label htmlFor="email">
            Email <span className="np-required">*</span>
          </label>
          <div className="np-input-wrapper">
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder=" "
              data-error={errors.email ? 'true' : 'false'}
            />
            <span className="np-input-border"></span>
          </div>
          {errors.email && <span className="np-error-message">{errors.email}</span>}
        </div>

        <div className={`np-form-field ${formData.phone ? 'np-field-filled' : ''} ${errors.phone ? 'np-field-error' : ''}`}>
          <label htmlFor="phone">
            Số điện thoại <span className="np-required">*</span>
          </label>
          <div className="np-input-wrapper">
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder=" "
              data-error={errors.phone ? 'true' : 'false'}
            />
            <span className="np-input-border"></span>
          </div>
          {errors.phone && <span className="np-error-message">{errors.phone}</span>}
        </div>

        <div className={`np-form-field ${formData.address ? 'np-field-filled' : ''}`}>
          <label htmlFor="address">Địa chỉ</label>
          <div className="np-input-wrapper">
            <input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              placeholder=" "
            />
            <span className="np-input-border"></span>
          </div>
        </div>

        <div className={`np-form-field ${formData.subject ? 'np-field-filled' : ''} ${errors.subject ? 'np-field-error' : ''}`}>
          <label htmlFor="subject">
            Tiêu đề <span className="np-required">*</span>
          </label>
          <div className="np-input-wrapper">
            <input
              id="subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder=" "
              data-error={errors.subject ? 'true' : 'false'}
            />
            <span className="np-input-border"></span>
          </div>
          {errors.subject && <span className="np-error-message">{errors.subject}</span>}
        </div>

        <div className={`np-form-field np-textarea-field ${formData.message ? 'np-field-filled' : ''} ${errors.message ? 'np-field-error' : ''}`}>
          <label htmlFor="message">
            Nội dung <span className="np-required">*</span>
          </label>
          <div className="np-input-wrapper">
            <textarea
              id="message"
              name="message"
              rows={6}
              value={formData.message}
              onChange={handleChange}
              required
              placeholder=" "
              data-error={errors.message ? 'true' : 'false'}
            />
            <span className="np-input-border"></span>
          </div>
          {errors.message && <span className="np-error-message">{errors.message}</span>}
        </div>

        <div className={`np-form-field np-captcha-field ${captchaValue ? 'np-field-filled' : ''} ${errors.captcha ? 'np-field-error' : ''}`}>
          <label htmlFor="captcha">
            CAPTCHA <span className="np-required">*</span>
          </label>
          <div className="np-captcha-wrapper">
            <div className="np-captcha-question">
              <div className="np-captcha-numbers">
                <span className="np-captcha-num">{captchaAnswer.num1}</span>
                <span className="np-captcha-operator">+</span>
                <span className="np-captcha-num">{captchaAnswer.num2}</span>
                <span className="np-captcha-equals">=</span>
                <span className="np-captcha-question-mark">?</span>
              </div>
              <small>Câu hỏi này dùng để kiểm tra xem bạn là người hay là chương trình tự động.</small>
            </div>
            <div className="np-input-wrapper">
              <input
                id="captcha"
                name="captcha"
                type="number"
                value={captchaValue}
                onChange={(e) => {
                  setCaptchaValue(e.target.value);
                  if (errors.captcha) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.captcha;
                      return newErrors;
                    });
                  }
                }}
                required
                placeholder=" "
                className="np-captcha-input"
                data-error={errors.captcha ? 'true' : 'false'}
              />
              <span className="np-input-border"></span>
            </div>
            {errors.captcha && <span className="np-error-message">{errors.captcha}</span>}
          </div>
        </div>

        <div className="np-form-footer">
          <button 
            type="submit" 
            className={`np-btn-primary np-btn-submit ${isSubmitting ? 'np-btn-loading' : ''} ${submitSuccess ? 'np-btn-success' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="np-btn-spinner"></span>
                <span>Đang gửi...</span>
              </>
            ) : submitSuccess ? (
              <>
                <span className="np-btn-check">✓</span>
                <span>Đã gửi thành công!</span>
              </>
            ) : (
              <>
                <span>Gửi</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8h12M8 2l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ContactForm;
