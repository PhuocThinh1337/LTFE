import React from 'react';

interface Office {
  title: string;
  address: string;
  tel: string;
  fax?: string;
}

function OfficeInfo(): React.JSX.Element {
  const offices: Office[] = [
    {
      title: 'VĂN PHÒNG CHÍNH VÀ NHÀ MÁY',
      address: 'No. 14, Road 3A, Bien Hoa II Industrial Park, Long Hung Ward, Dong Nai Province, Vietnam',
      tel: '(84) 251 383 6579 – 383 6586 (8 lines)',
      fax: '(84) 251 3836346 – 3836349'
    },
    {
      title: 'NHÀ MÁY SỐ 2',
      address: 'Quang Minh Industrial Park, Hanoi',
      tel: '1800 6111'
    },
    {
      title: 'NHÀ MÁY SỐ 3',
      address: 'Ba Thien II Industrial Park, Phu Tho Province',
      tel: '1800 6111'
    },
    {
      title: 'NHÀ MÁY SỐ 4',
      address: 'KSB Industrial Park, Ho Chi Minh City',
      tel: '1800 6111'
    },
    {
      title: 'CHI NHÁNH HÀ NỘI',
      address: '5th Floor, 27 Tran Duy Hung Street, Yen Hoa Ward, Hanoi',
      tel: '(84) 24 3934 2000'
    }
  ];

  // Chi nhánh TP.HCM hiển thị riêng như một card Tel đơn giản
  const lastOffice: { title: string; tel: string } = {
    title: 'CHI NHÁNH TP.HỒ CHÍ MINH',
    tel: '(84) 28 3911 5609 – 3911 5610'
  };

  return (
    <div className="np-office-info">
      <h2>Thông tin liên hệ</h2>
      <div className="np-office-grid">
        {offices.map((office, index) => (
          <div key={index} className="np-office-card" data-aos="fade-up" data-aos-delay={index * 100}>
            <h3>{office.title}</h3>
            <p className="np-office-address">{office.address}</p>
            <p className="np-office-tel">
              <strong>Tel</strong> {office.tel}
            </p>
            {office.fax && (
              <p className="np-office-fax">
                <strong>Fax</strong> {office.fax}
              </p>
            )}
          </div>
        ))}
        
        {/* Card Tel đơn giản cho chi nhánh cuối cùng */}
        <div className="np-office-card np-office-card-tel" data-aos="fade-up" data-aos-delay="500">
          <p className="np-office-tel-only">
            <strong>Tel</strong> {lastOffice.tel}
          </p>
        </div>
      </div>
    </div>
  );
}

export default OfficeInfo;

