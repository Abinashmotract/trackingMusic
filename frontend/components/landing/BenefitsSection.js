export default function BenefitsSection({ benefits }) {
  return (
    <section className="benefits-section">
      <h2 className="section-title">Why Choose Milking Tracker?</h2>
      <div className="benefits-grid">
        {benefits?.map((benefit, index) => (
          <div key={index} className="benefit-card">
            <div className="benefit-icon">{benefit?.icon}</div>
            <h3 className="benefit-title">{benefit?.title}</h3>
            <p className="benefit-description">{benefit?.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
