import "./Card_Footer.css";
import companyLogo1 from "../../assets/CompanyLogo_1.jpeg";

function Footer() {
  return (
    <div className="footer-card">
      <div className="footer-powered-by">
        <span>Powered by</span>
        <img
          src={companyLogo1}
          alt="ELVA"
          className="footer-company-logo"
        />
      </div>
    </div>
  );
}

export default Footer;
