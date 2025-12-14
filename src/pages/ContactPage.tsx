import React, { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Breadcrumb from '../components/common/Breadcrumb';
import ContactForm from '../components/contact/ContactForm';
import OfficeInfo from '../components/contact/OfficeInfo';
import ContactHotline from '../components/contact/ContactHotline';

function ContactPage(): React.JSX.Element {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    // Page load animation - set immediately
    setIsLoaded(true);
    
    // Also ensure app is visible immediately
    const appElement = document.querySelector('.np-app');
    if (appElement instanceof HTMLElement) {
      appElement.style.opacity = '1';
    }

    // Enhanced scroll animations with stagger effect
    const observerOptions: IntersectionObserverInit = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting && entry.target instanceof HTMLElement) {
          // Stagger animation delay
          const delay = (index % 5) * 100;
          const target = entry.target as HTMLElement;
          
          setTimeout(() => {
            target.style.opacity = '1';
            target.style.transform = 'translateY(0)';
            target.classList.add('np-animated');
          }, delay);
        }
      });
    }, observerOptions);

    // Observe all animated elements
    const elements = document.querySelectorAll('[data-aos]');
    elements.forEach((el) => {
      if (el instanceof HTMLElement) {
        observer.observe(el);
      }
    });

    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    // Parallax effect for title section
    const handleScroll = (): void => {
      const scrolled = window.pageYOffset;
      const titleSection = document.querySelector('.np-contact-title-section');
      if (titleSection instanceof HTMLElement) {
        const rate = scrolled * 0.3;
        titleSection.style.transform = `translateY(${rate}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`np-app ${isLoaded ? 'np-loaded' : ''}`}>
      <Header />

      <main className="np-main" id="contact">
        <Breadcrumb
          items={[
            { label: 'Trang chủ', link: '/' },
            { label: 'Liên hệ' }
          ]}
        />

        <section className="np-contact-title-section" data-aos="fade-up">
          <div className="np-container">
            <h1 className="np-title-animated">Thông tin liên hệ</h1>
            <p className="np-subtitle-animated">
              Bạn muốn trở thành đại lý chính thức của sơn Nippon hay cần tư vấn về sản phẩm, màu
              sắc? Liên hệ ngay với chúng tôi để được hỗ trợ kịp thời nhé!
            </p>
          </div>
        </section>

        <section className="np-contact-content">
          <div className="np-container">
            <div className="np-contact-layout">
              <div className="np-contact-left" data-aos="fade-right" data-aos-delay="100">
                <ContactForm />
              </div>
              <div className="np-contact-right" data-aos="fade-left" data-aos-delay="200">
                <OfficeInfo />
              </div>
            </div>
          </div>
        </section>

        <section className="np-contact-hotline-section" data-aos="fade-up" data-aos-delay="300">
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

