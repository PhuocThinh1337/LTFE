import React, { useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Breadcrumb from '../components/common/Breadcrumb';
import ContactForm from '../components/contact/ContactForm';
import OfficeInfo from '../components/contact/OfficeInfo';
import ContactHotline from '../components/contact/ContactHotline';

function ContactPage(): React.JSX.Element {
  useEffect(() => {
    // Simple AOS-like animation on scroll
    const observerOptions: IntersectionObserverInit = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target instanceof HTMLElement) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('[data-aos]');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="np-app">
      <Header />

      <main className="np-main" id="contact">
        <Breadcrumb
          items={[
            { label: 'Trang chủ', link: '/' },
            { label: 'Liên hệ' }
          ]}
        />

        <section className="np-contact-title-section">
          <div className="np-container">
            <h1>Thông tin liên hệ</h1>
            <p>
              Bạn muốn trở thành đại lý chính thức của sơn Nippon hay cần tư vấn về sản phẩm, màu
              sắc? Liên hệ ngay với chúng tôi để được hỗ trợ kịp thời nhé!
            </p>
          </div>
        </section>

        <section className="np-contact-content">
          <div className="np-container">
            <div className="np-contact-layout">
              <div className="np-contact-left">
                <ContactForm />
              </div>
              <div className="np-contact-right">
                <OfficeInfo />
              </div>
            </div>
          </div>
        </section>

        <section className="np-contact-hotline-section">
          <div className="np-container">
            <ContactHotline />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default ContactPage;

