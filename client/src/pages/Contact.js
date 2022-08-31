import React from 'react'; 
import Header from '../layout/Header'
import Footer from '../layout/Footer'
 
import {  useTranslation} from 'react-i18next'
 

const Contact = () => {
  
  const {t, i18n } = useTranslation() 


  return (
      <div> 
        <Header /> 
        <div className="clear"></div>
        <div className="container bootstrap snippets">
            <div className="row text-center" >
           
              <div className="col-sm-4" >
                <div className="contact-detail-box">
                  <img src="https://cdn2.iconfinder.com/data/icons/contact-us-set-1-1/64/x-16-2-256.png" className="fa fa-map-marker fa-3x text-colored" style={{width: "50px" }} />
                  <h4> {t("ContactPage.CallUs")} </h4>
                  <abbr title="Phone">P:</abbr>(+995) 599 29 97 29<br/>
                  E: <a href="mailto:email@email.com" className="text-muted">viptire090@gmail.com</a>
                </div>
              </div> 
              
              <div className="col-sm-4">
                  <div className="contact-detail-box">
                      <img src="https://cdn3.iconfinder.com/data/icons/unigrid-phantom-maps-travel-vol-1/60/007_008_map_pin_locate_location_marker_gps_coordinate-256.png" className="fa fa-map-marker fa-3x text-colored" style={{width: "50px" }}/> 
                      <h4>{t("ContactPage.OurLocation")}</h4>
          
                      <address>
                      {t("ContactPage.Address1")}<br/>
                      {t("ContactPage.Address2")}<br/>
                    </address>
                    
                  </div> 
              </div> 
                  <div className="col-sm-4">
                    <div className="contact-detail-box">
                      <img src="https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Whatsapp2_colored_svg-256.png" className="fa fa-map-marker fa-3x text-colored" style={{width: "50px" }}/>
                      <h4> {t("ContactPage.Support")}</h4>
                      <address>
                        whatsapp: (+995) 599 29 97 29
                      </address>
          
                    </div>
                  </div>  


              
          
      
      
            <div className="row">
              <div className="col-sm-12">
                <div className="contact-map">
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2976.3750778584267!2d44.761506631737696!3d41.75557034296052!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40447264fde8d7bf%3A0xdcc393a9b8b40197!2zNjcg4YOV4YOQ4YOh4YOdIOGDkuGDneGDq-GDmOGDkOGDqOGDleGDmOGDmuGDmOGDoSDhg6Xhg6Phg6nhg5AsIOGDl-GDkeGDmOGDmuGDmOGDoeGDmA!5e0!3m2!1ska!2sge!4v1602351047375!5m2!1ska!2sge" width="100%" height="360px" frameborder="0" style={{border:0}} allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>            
                </div> 
              </div>  
            </div>  


          </div>  
        </div>

        <Footer />
    
      </div>
    )
 
}

export default Contact
