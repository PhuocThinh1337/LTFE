import React from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  link?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

function Breadcrumb({ items }: BreadcrumbProps): React.JSX.Element {
  return (
    <section className="np-breadcrumb">
      <div className="np-container">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <span className="np-breadcrumb-separator">/</span>}
            {item.link ? (
              <Link to={item.link} className="np-breadcrumb-link">
                {item.label}
              </Link>
            ) : (
              <span className="np-breadcrumb-current">{item.label}</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

export default Breadcrumb;

