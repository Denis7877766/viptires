import React from 'react'; 
import Header from '../layout/Header'
import Footer from '../layout/Footer' 
 
import {  useTranslation} from 'react-i18next'
 
const Contact = () => {
  
    const {t, i18n } = useTranslation() 
   
    return (
      <div>

          <Header /> 
          <section className="about-section" >
            <div className="container">
                <div className="row">                
                      <div className="content-column col-lg-6 col-md-12 col-sm-12 order-2">
                          <div className="inner-column">
                              <div className="sec-title"style={{marginTop:20}}>
                                  
                                  <h2> {t("AboutusPage.About1")} <br/> {t("AboutusPage.About2")} </h2>
                              </div>
                              <div className="text"> 
                              {t("AboutusPage.About3")} 
                              <p>  {t("AboutusPage.About4")} </p>
                                
                              </div>
                              <ul className="list-style-one">
                                  <li> {t("AboutusPage.About5")} </li>
                                  <li> {t("AboutusPage.About6")} </li>
                                  <li> {t("AboutusPage.About7")} </li>
                              </ul>
                              <div className="btn-box">
                                  <a href="/contact" className="theme-btn btn-style-one">  {t("AboutusPage.About8")}  </a>
                              </div>
                          </div>
                      </div>

                    
                      <div className="image-column col-lg-6 col-md-12 col-sm-12">
                          <div className="inner-column wow fadeInLeft">
                              <figure className="image-1"><img src="https://sailuntires.com.ph/wp-content/uploads/2018/09/tire-shop.png" alt="" style={{height: "400px"}}/></figure>
                              <figure className="image-2"><img src="https://continentalautogroup.com/images/site/tires/tire_warehouse.jpg" alt=""/></figure>
                          </div>
                      </div>
                            
                </div>
                
            </div>
        </section> 

          <Footer />
    
      </div>
    )
 
  }
  
  export default Contact
  