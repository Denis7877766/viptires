import React from 'react'; 
import Header from '../layout/Header'
import Footer from '../layout/Footer' 
import bearway1 from '../images/bearway1.png' 
import maxtrek from '../images/maxtrek.png'
import tyres from '../images/tyres.PNG'
import tyres1 from '../images/tyres1.jpg'
import tyres2 from '../images/tyres2.jpg'
import used_ge from '../images/used.png'
import used_en from '../images/used_en.png'
import used_ru from '../images/used_ru.png' 
import FT1 from '../images/ft1.jpg'
import FT2 from '../images/ft2.jpg'
import FT3 from '../images/ft3.jpg' 
import axios from 'axios'
import { withTranslation } from 'react-i18next';

 class Home extends React.Component {
 
  state = {
    products : [], 
    products_filtered: [],
    products_searched: false, 
    currencyInUsd : false,
    currency_rate : 0, 
    currencyApiIssue: true,  
    apiError1: false,
    apiError2: false, 
    searchStatus : '',
    noProductsErrMessage: false, 

}


getData = async () => {
  try{    
    
    // ORDER BY IN SALE STATUS
    function compare( a, b ) {
      if ( a.inSale < b.inSale ){
        return -1
      }
      if ( a.inSale > b.inSale ){
        return 1
      }
      return 0
    } 
      
     
      // GET PRODUCTS
      await axios 
      .get('/api/products')
      .then(res => {
          if(res.status === 200){  
              if(res.data.length){
                  let data = res.data.filter(record => record.inSale === true)
                  console.log('PRODUCTS:', data)
                  this.setState({products: data})
              }else{ 
                this.setState({apiError1: true})
              }
          }else{
              this.setState({apiError2: true})
          }
      }) 

     


      // GET CURRENCY FROM NBG
      await axios 
      .get('/api/currency/usd')
      .then(async (res) => { 
        console.log('GOT NBG CURRENCY RES:', res.status)
          if(res.status === 200){ 
            console.log('NBG RESPONSE:', res.data)
            
            // Update USD rate to database
            if(res.data.data != '' && !isNaN(parseInt(res.data.data)) ){
              console.log('PASSED')
              let rate =  res.data.data
              this.setState({currency_rate: rate})

              await axios 
              .post('/api/settings/update/currency', { name : "last_currency_rate", value: rate})
              .then(c_res => { 
                  if(c_res.status === 200){ 
                    console.log('USD rate Updated')
                  } 
              })
            }   

          } 
      }) 



     // GET LAST CURRENCTRATE  FROM DB
     await axios 
     .get('/api/settings/usd_rate')
     .then(async (res) => { 
         if(res.status === 200){ 
            
             if(res.data.length){
                let rate = res.data[0].value
                if(!isNaN(Number(rate))){
                   console.log('USD RATE UPDATED TO STATE:', rate)
                  this.setState({currency_rate: rate, currencyApiIssue: false})
                }else{
                  this.setState({currencyApiIssue: true})
                }
             }else{
              this.setState({currencyApiIssue: true})
             }
         }else{
           this.setState({currencyApiIssue: true})
         }
     }) 

  }catch(e){
      console.log(e)
  }
}




async componentDidMount(){ 
  await this.getData()
}


  render() {
    return (
      <div>

          <Header /> 
           
    
          <div className="clear"> </div>
            <div className="slider">
              <div className="slide">
              <p className="slide-desc">{this.props.t("Homepage.Slider_text1")} </p>
              </div>
              <div className="slide">
                
                <p className="slide-desc">{this.props.t("Homepage.Slider_text1")} </p>	  </div>
              <div className="slide">
                <p className="slide-desc">{this.props.t("Homepage.Slider_text1")} </p>	  </div>
              <button className="arrow prev">{'<'}</button>
              <button className="arrow next">{'>'}</button>
            </div>


            <section id="our-program">
              <div className="container">
              
                <div className="top text-center">
                    <h1 style={{color:"#029eb7"}}> {this.props.t("Homepage.Catalog")} </h1> 
                </div>

                <main className="container">
                  <div className="col-md-12">
                    <div className="col-md-4">
                      <div className="card">
                        <div className="tile">
                          <div className="recipe-title">
                          <a href = "./products/secondary"><img src={ this.props.i18n.language === 'ge' ? used_ge : this.props.i18n.language === 'en' ? used_en : used_ru} alt="" /></a>
                            
                          </div>
                          <div className="arrow-down"></div>
                        </div>
                        <div className="hidden-box">
                          <div className="img-placeholder">
                            <img src={tyres2} height="410" width="600" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card v2">
                        <div className="tile">
                          
                          <div className="recipe-title">
                            <a href = "./products/maxtrek"><img src={maxtrek} alt="" /></a>
                          
                          </div>
                          <div className="arrow-down"></div>
                        </div>
                        <div className="hidden-box">
                          <div className="img-placeholder">
                            <img src={tyres1} height="410" width="600" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card">
                        <div className="tile">
                          <div className="recipe-title">
                            <a href="./products/bearway">  <img src={bearway1} /></a>
                          </div>
                          <div className="arrow-down"></div>
                        </div>
                        <div className="hidden-box">
                          <div className="img-placeholder">
                            <img src="https://photos.offerup.com/2A9KaJ2URMKO7nhnBnLQydT7gfA=/600x801/92cc/92cc52a9484d4413b68b3ee2cb44e9ca.jpg" height="300" width="600" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>		
                </main>
              </div>
          </section>


          <img src="https://cdn0.iconfinder.com/data/icons/contact-16/512/039-info-256.png" alt="" style={{width: "100px", marginLeft: "48%", marginTop: "250px"}}  />
          <div className="draw-container">
            <div className="trapezoid"><span className = 'separator'> {this.props.t("Homepage.part1_title")} </span></div>
          </div>
          <div className="container">
            <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
              <div className="hovereffect">
                <img className="img-responsive" src="http://st.motortrend.com/uploads/sites/5/2014/10/2015-Jaguar-F-Type-R-Coupe-front-view-from-road.jpg" alt="" />
                <div className="overlay">
                  <h2> {this.props.t("Homepage.part1_text1")} </h2>
                  <div className="info">
                    <div className="col-xs-8 col-sm-6 col-md-6 col-lg-6">
                      <h4>  {this.props.t("Homepage.part1_text2")} </h4>
                    </div>
                    <div className="col-xs-4 col-sm-6 col-md-6 col-lg-6">
                      <div className="scaleimage">
                      <img src="https://di-uploads-development.s3.amazonaws.com/autosource/uploads/2017/08/shield.png" alt="" /></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
            
              <div className="hovereffect">
                <img className="img-responsive" src="http://cdn.bmwblog.com/wp-content/uploads/epcp_1103_01_o-michelin_pilot_super_sport-tires.jpg" alt="" />
                <div className="overlay">
                  <h2>{this.props.t("Homepage.part2_title")}</h2>
                  <div className="info">
                    
                    <div className="col-xs-8 col-sm-6 col-md-6 col-lg-6">
                      <h4> {this.props.t("Homepage.part2_text")}</h4>
                    
                    </div>
                    
                    <div className="col-xs-4 col-sm-6 col-md-6 col-lg-6">
                      <div className="scaleimage">
                      <img src="https://di-uploads-development.s3.amazonaws.com/autosource/uploads/2017/08/tire.png" alt="" />
                    </div>
                    </div>
                    </div>
                </div>
              </div>
            </div>
          </div>

          <img src="https://cdn3.iconfinder.com/data/icons/leto-blue-real-estate-2/64/__property_house_sale-256.png" alt="" style={{width: "100px", marginLeft: "48%", marginTop: "250px"}} />
          <div className="draw-container">
            <div className="trapezoid"><span className = 'separator'>  {this.props.t("Homepage.Insale")}</span></div>
          </div>



       

          {this.state.products.length > 0 && this.state.apiError1 === false && this.state.apiError2 === false && ( 
                <div className="row" >
                    { this.state.products.map((item, i) => {
                        return (
                        
                        <div  key={i} >
                            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12 product filter"> 
                            <img src={item.img_url.length ? item.img_url : tyres} title="Product name" alt="Product name" /> 

                            {item.inSale === true ? (
                                <div className="ribbon-container">
                                <div className="ribbon-bottom"></div>
                                <div className="ribbon-triangle"></div>
                                <h4 className="red">{this.props.t("CatalogPage.sale")}</h4>
                                </div>
                            ) :''}
                                <div className="info">
                                <div className="name">
                                {item.brand}
                                </div> 
                                <img src="https://cdn4.iconfinder.com/data/icons/currency-38/512/177_Lari_Currency_Georgia_Georgian-256.png" style={{width: "25px", height: "25px", marginTop: "10px"}} />
                                <label className="el-switch el-switch-yellow" >
                                    <input type="checkbox" name="switch" onChange={e => this.setState({currencyInUsd: e.target.checked})} checked={this.state.currencyInUsd} disabled={this.state.currencyApiIssue === true}/>
                                    <span className="el-switch-style"  style={{width:"50px",marginTop: "12px"}}></span>
                                </label>
                                <img src="https://cdn3.iconfinder.com/data/icons/basicolor-money-finance/24/223_dollar_usd_currency-256.png" style={{width: "25px",height: "25px", marginRight: "20%",marginTop: "10px"}} />

                                <div className="price"> 
                                
                                    {item.inSale === true ? (
                                    <div>
                                        <span className="original-price">{this.state.currencyInUsd === true? Math.ceil(Number(item.price) / Number(this.state.currency_rate)) : item.price}</span>{this.state.currencyInUsd ? Math.ceil(Number(item.disscountPrice) / Number(this.state.currency_rate)) : item.disscountPrice}  
                                        </div> 
                                    ) : this.state.currencyInUsd ?Math.ceil( Number( item.price) / Number(this.state.currency_rate)) :  item.price}
                                    
                                    
                                </div>
                                </div>
                                <div id="specs">
                                <span id="brand">{this.props.t("CatalogPage.brand")}</span>
                                <span id="brand">{item.brand} </span>
                                </div>
                                <div id="specs">
                                <span id="size">{this.props.t("CatalogPage.size")}</span>
                                <span id="size">{item.size}</span>
                            </div>
                            <div id="specs">
                                <span id="season">{this.props.t("CatalogPage.season")}</span>
                                <span id="season">  {this.props.t(`CatalogPage.${item.season.toString().toLowerCase()}`)}    </span>
                            </div>
                            </div> 
                        </div>
                        
                        )
                    })
                    }
                </div> 
            )} 
          <div className="clear"></div>




          <div className="clear"></div>





          <img src="https://cdn4.iconfinder.com/data/icons/logistic-delivery-solid-icons-vol-3/72/104-256.png" alt=""style={{width: "100px", marginLeft: "48%", marginTop: "250px"}} />
          <div className="container-fluid contenedor text-center">
            
            <div className=" container text-center"  style={{ margin: "0 auto", alignSelf: "center"}}>  
              <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12 container_foto " style={{width:280, height:210, marginLeft:50}}>
                  <div className="ver_mas text-center">
                    <span  className="lnr lnr-eye"></span>
                  </div>
                  <article className="text-left">
                    <h2>{this.props.t("Homepage.part3_text1")}<br/>24,10,2020 </h2>
                    <h4>{this.props.t("Homepage.part3_text2")}</h4>
                  </article>
                  <img src={FT1}  />
                </div>
              <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12 container_foto" style={{width:280, height:210}}>
                  <div className="ver_mas text-center">
                    <span id="click" className="lnr lnr-eye"></span>
                  </div>
                  <article className="text-left">
                    <h2> {this.props.t("Homepage.part4_text1")}</h2>
                    <h4>{this.props.t("Homepage.part4_text2")}</h4>
                  </article>
                  <img src={FT2}  />
                    </div>
              <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12 container_foto"style={{width:280, height:210}}>
                  <div className="ver_mas text-center">
                    <span className="lnr lnr-eye"></span>
                  </div>
                  <article className="text-left">
                    <h2>{this.props.t("Homepage.part5_text1")}</h2>
                    <h4>{this.props.t("Homepage.part5_text2")}</h4>
                  </article>
                  <img src={FT3} />
              </div>
            </div>
          </div>




          <Footer />
    
      </div>
    )
  }

}
export default withTranslation()(Home)