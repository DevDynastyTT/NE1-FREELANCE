import '../static/css/footer.css'

const GlobalFooter = () => {
    return(
    //     <footer className="footer">

    //     <div className="footer-top section">
    //       <div className="container">

    //         <div className="footer-brand">

    //           <a href="#" className="logo">
    //             <img src=" static 'images/logo.png' %}" width="128" height="63" alt="NE1-Freelance Logo"/>
    //           </a>

    //           <p className="footer-text">
    //           Rerum necessitatibus saepe eveniet aut et voluptates repudiandae sint et molestiae non recusandae.
    //           </p>

    //         <ul className="social-list">

    //           <li>
    //             <a href="#" className="social-link">
    //               <img src="{% static 'images/facebook.svg' %}" alt="facebook"/>
    //             </a>
    //           </li>

    //           <li>
    //             <a href="#" className="social-link">
    //               <img src="{% static 'images/instagram.svg' %}" alt="instagram"/>
    //             </a>
    //           </li>

    //           <li>
    //             <a href="#" className="social-link">
    //               <img src="{% static 'images/twitter.svg' %}" alt="twitter"/>
    //             </a>
    //           </li>

    //         </ul>

    //       </div>

    //       <ul className="footer-list">

    //         <li>
    //           <p className="h3">Opening Hours</p>
    //         </li>

    //         <li>
    //           <p className="p">Monday TO Saturday</p>

    //           <span className="span">12.00 to 14.45</span>
    //         </li>

    //         <li>
    //           <p className="p">Sunday TO Thursday</p>

    //           <span className="span">17.30 to 00.00</span>
    //         </li>

    //         <li>
    //           <p className="p">Friday TO Saturday</p>

    //           <span className="span">12.00 to 14.45</span>
    //         </li>

    //       </ul>

    //       <ul className="footer-list">

    //         <li>
    //           <p className="h3">Contact Info</p>
    //         </li>

    //         <li>
    //           <a href="tel:+01234567890" className="footer-link">
    //             <span className="material-symbols-rounded">call</span>

    //             <span className="span">+01 868 7388075</span>
    //           </a>
    //         </li>

    //         <li>
    //           <a href="mailto:info@autofix.com" className="footer-link">
    //             <span className="material-symbols-rounded">mail</span>

    //             <span className="span">868drgnstudio@gmail.com</span>
    //           </a>
    //         </li>

    //         <li>
    //           <address className="footer-link address">
    //             <span className="material-symbols-rounded">location_on</span>

    //             <span className="span">66 Cipriani Street Morvant</span>
    //           </address>
    //         </li>

    //       </ul>

    //   </div>

    //   <img src="pics/footer-shape-3.png" width="637" height="173" loading="lazy" alt="Shape"
    //     className="shape shape-3 move-anim"/>

    //   </div>

    //   <div className="footer-bottom">
    //     <div className="container">

    //       <p className="copyright">Copyright 2022, NE1-Freelance All Rights Reserved.</p>

    //       <img src="{% static 'images/footer-shape-2.png' %}" width="778" height="335" loading="lazy" alt="Shape"
    //         className="shape shape-2"/>

    //       <img src="pics/footer-shape-1.png" width="805" height="652" loading="lazy" alt="Red Car"
    //         className="shape shape-1 move-anim"/>

    //     </div>
    //   </div>

    // </footer>

    // Site footer>
    <footer className="site-footer">
      <div className="container">
        <div className="row">
          <div className="col-sm-12 col-md-6">
            <h6>About</h6>
            <p className="text-justify">Scanfcode.com <i>CODE WANTS TO BE SIMPLE </i> is an initiative  to help the upcoming programmers with the code. Scanfcode focuses on providing the most efficient code or snippets as the code wants to be simple. We will help programmers build up concepts in different programming languages that include C, C++, Java, HTML, CSS, Bootstrap, JavaScript, PHP, Android, SQL and Algorithm.</p>
          </div>

          <div className="col-xs-6 col-md-3">
            <h6>Categories</h6>
            <ul className="footer-links">
              <li><a href="http://scanfcode.com/category/c-language/">C</a></li>
              <li><a href="http://scanfcode.com/category/front-end-development/">UI Design</a></li>
              <li><a href="http://scanfcode.com/category/back-end-development/">PHP</a></li>
              <li><a href="http://scanfcode.com/category/java-programming-language/">Java</a></li>
              <li><a href="http://scanfcode.com/category/android/">Android</a></li>
              <li><a href="http://scanfcode.com/category/templates/">Templates</a></li>
            </ul>
          </div>

          <div className="col-xs-6 col-md-3">
            <h6>Quick Links</h6>
            <ul className="footer-links">
              <li><a href="http://scanfcode.com/about/">About Us</a></li>
              <li><a href="http://scanfcode.com/contact/">Contact Us</a></li>
              <li><a href="http://scanfcode.com/contribute-at-scanfcode/">Contribute</a></li>
              <li><a href="http://scanfcode.com/privacy-policy/">Privacy Policy</a></li>
              <li><a href="http://scanfcode.com/sitemap/">Sitemap</a></li>
            </ul>
          </div>
        </div>
        <hr/>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-8 col-sm-6 col-xs-12">
            <p className="copyright-text">Copyright &copy; 2017 All Rights Reserved by 
         <a href="#">Scanfcode</a>.
            </p>
          </div>

          <div className="col-md-4 col-sm-6 col-xs-12">
            <ul className="social-icons">
              <li><a className="facebook" href="#"><i className="fa fa-facebook"></i></a></li>
              <li><a className="twitter" href="#"><i className="fa fa-twitter"></i></a></li>
              <li><a className="dribbble" href="#"><i className="fa fa-dribbble"></i></a></li>
              <li><a className="linkedin" href="#"><i className="fa fa-linkedin"></i></a></li>   
            </ul>
          </div>
        </div>
      </div>
</footer>
    )
}

export default GlobalFooter;