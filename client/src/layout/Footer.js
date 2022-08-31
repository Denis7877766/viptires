import React from 'react'; 

import Logo from '../images/logo2.svg'
import facebookIcon from '../images/facebook.svg'
import instagramIcon from '../images/instagram.svg'
import youtubeIcon from '../images/youtube.svg'

import { useTranslation} from 'react-i18next'
 

const Footer = () => {
    const {t} = useTranslation() 
   
    return (
        <div>
            <div className="clear"></div>
                <div className="footer" style={{marginTop: 20}}>
                
                    <div className="inner-footer"> 
                        <div className="footer-items" style={{width:"25%"}}>
                            <a> 
                                <img src={Logo} alt="" style={{marginTop: "20%"}} />
                            </a> 
                        </div>   
                        <div className="footer-items"  style={{marginLeft:50}}>
                            <h3 style={{marginLeft: 30}}>{t("Footer.Map")}</h3>
                            <div className="border1" style={{marginLeft: 30, width: 100}}></div>  
                            <ul style={{marginTop: 25}}>
                                <li> 
                                    <a href="/"> {t("Footer.Home")} </a>
                                </li> 
                                <li>
                                    <a href="/catalog">  {t("Footer.Catalog")} </a>
                                </li>
                                <li>
                                    <a href="/about">  {t("Footer.About")}</a>
                                </li>
                                <li>
                                    <a href="/contact">  {t("Footer.Contact")} </a>
                                </li>
                            </ul>
                        </div> 
                   
                        <div className="footer-items">
                            <h3> {t("Footer.Contact_footer")}</h3>
                            <div className="border1" style={{ width: 130}}></div>
                            <ul  style={{marginTop: 25}}>
                                <li><i className="fa fa-map-marker" aria-hidden="true"></i>{t("Footer.Address")}</li>
                                <li><i className="fa fa-phone" aria-hidden="true"></i>(+995)596 72 90 90</li>
                                <li><i className="fa fa-envelope" aria-hidden="true"></i> viptire090@gmail.com</li>
                            </ul> 
                        
                
                            <div className="social-media">
                                <a href="https://www.facebook.com/Vip-Tire-100994378449193/" > <img src={facebookIcon} alt=""/>  </a>
                                <a href="https://www.instagram.com/viptire/" > <img src={instagramIcon} alt=""/>  </a>
                                <a href="https://www.youtube.com/" > <img src={youtubeIcon} alt=""/>  </a>
                            </div> 
                        </div>
                    </div> 
                    <div className="footer-bottom">
                        &copy; VipTire 2020. {t("Footer.Copyright")}
                    </div>
            </div>
        </div>
     )
    }
    
export default Footer
    
    
    
     