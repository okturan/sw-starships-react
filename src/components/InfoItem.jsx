const InfoItem = ({ icon, label, value }) => {
  return (
    <div className="info-item">
      <span>
        {icon && <span className="info-icon" aria-hidden="true">{icon}</span>}
        <strong>{label}</strong>
      </span>
      <span>{value}</span>
    </div>
  );
};

export default InfoItem;
