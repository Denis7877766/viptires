import React from 'react';  
import Logo from '../images/logo2.svg'
 
import facebookIcon from '../images/facebook.svg'
import instagramIcon from '../images/instagram.svg'
import youtubeIcon from '../images/youtube.svg'
import {  useTranslation} from 'react-i18next'
 

const Header = () => {
  
  const {t, i18n } = useTranslation()
  const changeLanguage = lang => {
    i18n.changeLanguage(lang)
  }


  return (
      <div>
        <header> 

              <div className="main-header">
                <div className="topbar-desktop">
                  <div className="clear"></div>
                  
                  
                  <div className="raw">
                    <div className="flip-container" ontouchstart="this.classNameList.toggle('hover');">
                      <div className="flipper">
                      <a href="https://www.facebook.com/Vip-Tire-100994378449193/"><div className="front">
                          
                        <img src={facebookIcon} />
                        </div>
                        <div className="back">
                          <p>Facebook</p>
                        
                        </div></a>
                      </div>
                    </div>
                  
                    <div className="flip-container" ontouchstart="this.classNameList.toggle('hover');">
                      <div className="flipper">
                        <a href="https://www.instagram.com/viptire/"> <div className="front">
                          <img src={instagramIcon} />
                        </div>
                        <div className="back">
                          <p>Instagram</p>
                        </div>
                      </a></div>
                    </div>
                  <div className="flip-container" ontouchstart="this.classNameList.toggle('hover');">
                      <div className="flipper">
                      <a href="https://www.youtube.com/"><div className="front">
                          <img src={youtubeIcon} />
                        </div>
                        <div className="back">
                          <p>Youtube</p>
                        </div>
                      </a></div>
                    </div>
                    <div className="flip-container" ontouchstart="this.classNameList.toggle('hover');">
                      <div className="flipper">
                      <a href="./contact"><div className="front">
                          <img src="https://cdn4.iconfinder.com/data/icons/travel-and-holiday-3/32/location-256.png"/>
                        </div>
                        <div className="back">
                          <p>Location</p>
                        </div>
                    </a>  </div>
                    </div>
                    
                    <div className="firstInfo">
                      <img src="https://cdn1.iconfinder.com/data/icons/social-media-2112/29/Asset_30-256.png" alt="" id="viber"/> 
                      <span> (+995) 596 72 90 90</span> 
                      <img src="https://cdn1.iconfinder.com/data/icons/social-media-2112/29/Asset_10-256.png" alt="" id="watsapp"/> 
                      <span>(+995) 599 29 97 29</span>
                    </div> 
                    
                    
                    
                    <div className="switch-lang">
                    <div className="current-lang"><img className="lang-flag" src={t("language.main.img")} />
                       <p className="lang-text">{t("language.main.lang")}</p>
                    </div>
                    <div className="lang-dropdown">
                        <div className="selecting-lang"><img  onClick={() =>  changeLanguage(t("language.dropdown.first.change_to"))} className="lang-flag" src={t("language.dropdown.first.img")} />
                            <p className="lang-text" onClick={() =>  changeLanguage(t("language.dropdown.first.change_to"))}> {t("language.dropdown.first.lang")} </p>
                        </div>
                        <div className="selecting-lang"><img className="lang-flag" onClick={() =>  changeLanguage(t("language.dropdown.second.change_to"))}   src={t("language.dropdown.second.img")} />
                            <p className="lang-text" onClick={() =>changeLanguage(t("language.dropdown.second.change_to"))}>  {t("language.dropdown.second.lang")}</p>
                        </div>
                    </div>
                    
                </div>
                </div>
                </div>
                <div className="col-md-12 logo-container">
                  <div className="col-md-4 logo">
                    <div className="logo-inner">
                      <a href="/"> <img src={Logo} alt=""/></a>
                    </div>
                  </div>
                  
              

                <div className="col-md-8 contact-info">
                  <div className="col-md-4 col-md-offset-1" >
                    <div className="icon-holder"> <span className="icon glyphicon glyphicon-envelope"></span></div>
                <div className="content-holder"><span className="heading-span">{t("Header.Email")}</span><br /><span>viptire090@gmail.com</span></div>
                  </div>
                    <div className="col-md-4">
                    <div className="icon-holder"><span className="icon glyphicon glyphicon-time"></span></div>
                    <div className="content-holder"><span className="heading-span">{t("Header.WorkingHours")} </span><br /><span>{t("Header.Everyday")} <br />( 10 : 00 - 18 : 00 )</span></div>
                  </div>
                  <div className="col-md-3 call-box">
                    <button className="btn btn-custom"><span className="call-us">{t("Header.CallUs")}</span><br /><span className="contact-number">(+995)599 29 97 29</span></button>
                  </div>
                </div>
                <div className="clear">    </div>
                
                
                <div className="navcontainer">
                      <nav role="full-horizontal">
                        <ul>
                          <li> 
                            <a href="/"> {t("Header.Home")} </a>
                          </li>
                          
                          <li>
                            <a href="/catalog">  {t("Header.Catalog")} </a>
                          </li>
                          <li>
                            <a href="/about">  {t("Header.About")}</a>
                        </li>
                          <li>
                            <a href="/contact">  {t("Header.Contact")} </a>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </div>   
                </div>
         </header>
      </div>
      )
}

export default Header



 