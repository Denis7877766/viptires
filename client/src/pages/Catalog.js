import React from 'react'; 
import Header from '../layout/Header'
import Footer from '../layout/Footer'

import bearway1 from '../images/bearway1.png' 
import maxtrek from '../images/maxtrek.png' 
import tyres1 from '../images/tyres1.jpg'
import tyres2 from '../images/tyres2.jpg'
import used_ge from '../images/used.png'
import used_en from '../images/used_en.png'
import used_ru from '../images/used_ru.png'
import tyres from '../images/tyres.PNG'
import axios from 'axios'
 
import { withTranslation } from 'react-i18next';
 
class Catalog extends React.Component {
 

    state = {
        products : [], 
        products_filtered: [],
        products_searched: false,
      
        currencyInUsd : false,
        currency_rate : 0, 
        currencyApiIssue: false, 

        apiError1: false,
        apiError2: false,

        searchStatus : '',
        noProductsErrMessage: false,

        filter_by : "size",
        season: "season",
        width_filter_selected: "all",
        radius_filter_selected: "all",
        height_filter_selected: "all",
        selectedFilterOption : 'summer',

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
                        let data = res.data.sort(compare).reverse()   
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
        console.log("CURRENT LANGUAGE", this.props.i18n.language)
        console.log("PROPS", this.props)
        await this.getData()
    }


    handleSearchProducts = async () => {
        try{
            this.setState({products_searched: true})
            const filterBy = this.state.filter_by
            let products_all = []

            for(let i of this.state.products){
                products_all.push(i)
            } 

            function compare( a, b ) {
                if ( a.inSale < b.inSale ){
                  return -1
                }
                if ( a.inSale > b.inSale ){
                  return 1
                }
                return 0
            } 

            if(filterBy === 'category'){ 
                
                let categoryOption = this.state.selectedFilterOption 
                let filteredProducts = products_all.filter(record => {
                    return record.season === categoryOption
                })

                if(filteredProducts.length){
                    filteredProducts = filteredProducts.sort(compare).reverse()   
                    this.setState({products_filtered : filteredProducts})
                }else{ 
                    this.setState({noProductsErrMessage: true, products_filtered: []}) 
                }
           
            }else{
                console.log('FilteringBy size...')
                const width_filter_selected  = this.state.width_filter_selected
                const radius_filter_selected  = this.state.radius_filter_selected
                const height_filter_selected = this.state.height_filter_selected
                const current_season = this.state.season
                
                
                console.log('archeuli sezoni:', current_season)
                let filteredProducts = []

                console.log('---------------------------') 
                if(width_filter_selected === 'all' && radius_filter_selected === 'all' && height_filter_selected === 'all' && current_season === 'season'){
                    console.log("GETTING ALL")
                    this.setState({products_filtered : products_all})
                }else{
                    if(width_filter_selected !== 'all'){
                        console.log('FILTERING WITH  -- WIDTH')
                        for(let i of products_all){
                            if(i.size != null && i.size != undefined){
                                if(i.size.toString().includes('/')){
                                    let currentWidth = i.size.toString().split('/')[1] 
                                    if(currentWidth === width_filter_selected){
                                        filteredProducts.push(i)
                                    }
                                }
                            }
                        }
                    }

                    if((width_filter_selected !== 'all' && filteredProducts.length > 0) || width_filter_selected === 'all'){
                        if(radius_filter_selected !== 'all'){
                            console.log('FILTERING WITH  -- RADIUS')
                            if(filteredProducts.length){ 
                                filteredProducts = filteredProducts.filter(record => {
                                    return record.size.toString().split('/')[0] === radius_filter_selected
                                })  
                            }else{
                                for(let i of products_all){
                                    if(i.size != null && i.size != undefined){
                                        if(i.size.toString().includes('/')){
                                            let currentRadius = i.size.toString().split('/')[0] 
                                            if(currentRadius === radius_filter_selected){
                                                filteredProducts.push(i)
                                            }
                                        }
                                    }
                                }
                            }
                           
                        }
    
                        if((radius_filter_selected != 'all' && filteredProducts.length > 0) || radius_filter_selected ==='all'){
                            if(height_filter_selected !== 'all'){
                                console.log('FILTERING WITH  -- RADIUS')
                                if(filteredProducts.length){ 
                                    filteredProducts = filteredProducts.filter(record => {
                                        return record.size.toString().split('/')[2] === height_filter_selected
                                    })  
                                }else{
                                    for(let i of products_all){
                                        if(i.size != null && i.size != undefined){
                                            if(i.size.toString().includes('/')){
                                                let currentHeight = i.size.toString().split('/')[2] 
                                                if(currentHeight === height_filter_selected){
                                                    filteredProducts.push(i)
                                                }
                                            }
                                        }
                                    }
                                } 
                            }

                            if( height_filter_selected != 'all' && filteredProducts.length > 0 || height_filter_selected === 'all'){
                                if(current_season != 'season'){
                                    if(filteredProducts.length){
                                        filteredProducts = filteredProducts.filter(record => {
                                            return record.season === current_season
                                        }) 
                                    }else{
                                        filteredProducts = products_all.filter(record => {
                                            return record.season === current_season
                                        }) 
                                    }
                                }
                            } 
                        }  
                    } 
                   

                    if(filteredProducts.length){
                        this.setState({noProductsErrMessage: false, products_filtered: filteredProducts}) 
                    }else{
                        this.setState({noProductsErrMessage: true, products_filtered: []}) 
                    }
                   

                }
            }
           
        }catch(e){
            console.log(e)
        }
    }
    
  render() {
    
    return (
      <div>

        <Header /> 
            
             
                <div className="clear"></div>
                <div className="o-wrapper" style={{marginTop:30}}>
                    <div className="c-search-bar">
                 <h3 className="c-search-bar__title"  >{this.props.t("CatalogPage.Filter_title")}</h3>
                    <div className="c-search-bar__wrap">
                  

                    {/* {this.state.filter_by === 'category' && (
                        <div  style={{marginLeft:60}}> 
                            <select id="filter_by"  onChange={e => this.setState({filter_by: e.target.value})} >
                                <option value="size"  > {this.props.t("CatalogPage.size")} </option> 
                                <option value="category" selected={true}> {this.props.t("CatalogPage.season")} </option> 
                            </select>
                            <select name="" id="" className="c-search-bar__item" style={{width: 390}} onChange={e => this.setState({selectedFilterOption: e.target.value})} >
                                <option value="summer"> {this.props.t("CatalogPage.summer")} </option>
                                <option value="winter"> {this.props.t("CatalogPage.winter")} </option>
                                <option value="universal"> {this.props.t("CatalogPage.universal")} </option>
                            </select>
                            <button className="c-search-bar__btn c-search-bar__foot"  onClick={this.handleSearchProducts}>{this.props.t("CatalogPage.search")}</button>
                            {this.state.apiError1 === true && (
                                <div> 
                                    <h3 style={{color: "red"}}> {this.props.t("Messages.apiError1Message")}</h3>
                                </div>
                            )}    
                            {this.state.apiError2 === true && (
                                <div> 
                                    <h3 style={{color: "red"}}> {this.props.t("Messages.apiError2Message")}</h3>
                                </div>
                            )}  
                             {this.state.noProductsErrMessage === true && (
                                <div> 
                                    <h3 style={{color: "red"}}>{this.props.t("Messages.noProductsErrMessage")}  </h3>
                                </div>
                            )} 
                        </div>
                    )} */}
                    {this.state.filter_by === 'size' && (
                        <div style={{marginLeft:60}}> 
                            {/* <select id="filter_by"  onChange={e => this.setState({filter_by: e.target.value})} >
                                <option value="size" selected > {this.props.t("CatalogPage.size")} </option> 
                                <option value="category"> {this.props.t("CatalogPage.season")} </option> 
                            </select> */}
                            <select id="radius_filter" style={{width: 150}} onChange={e => this.setState({radius_filter_selected: e.target.value})} >
                                <option value="all" selected> {this.props.t("CatalogPage.diameter")} (R) </option> 
                                <option value="R12"> R 12 </option>
                                <option value="R13"> R 13 </option>
                                <option value="R14"> R 14 </option>
                                <option value="R15"> R 15 </option>
                                <option value="R16"> R 16 </option>
                                <option value="R17"> R 17 </option>
                                <option value="R18"> R 18 </option>
                                <option value="R19"> R 19 </option>
                                <option value="R20"> R 20 </option>
                                <option value="R21"> R 21 </option>
                                <option value="R22"> R 22 </option>
                                <option value="R23"> R 23 </option>
                                <option value="R24"> R 24 </option>
                                <option value="R25"> R 25 </option>
                                <option value="R26"> R 25 </option>
                                <option value="R27"> R 26 </option>
                                <option value="R28"> R 27 </option>
                                <option value="R12C"> R 12 C </option>
                                <option value="R13C"> R 13 C </option>
                                <option value="R14C"> R 14 C </option>
                                <option value="R15C"> R 15 C </option>
                                <option value="R16C"> R 16 C </option>
                                <option value="R17C"> R 17 C</option>
                                <option value="R18C"> R 18 C </option>
                                <option value="R19C"> R 19 C </option>
                                <option value="R20C"> R 20 C </option>
                                <option value="R21C"> R 21 C </option>
                                <option value="R22C"> R 22 C </option>
                                <option value="R23C"> R 23 C </option>
                                <option value="R24C"> R 24 C </option>
                                <option value="R25C"> R 25 C </option>
                                <option value="R26C"> R 25 C </option>
                                <option value="R27C"> R 26 C </option>
                                <option value="R28C"> R 27 C </option>
                            </select>
                            <select id="width_filter"  style={{width: 120}}  onChange={e => this.setState({width_filter_selected: e.target.value})}>
                                <option value="all" selected> {this.props.t("CatalogPage.width")} </option> 
                                <option value="145"> 145  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="150"> 150  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="155"> 155  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="160"> 160  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="165"> 165  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="170"> 170  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="175"> 175  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="180"> 180  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="185"> 185  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="190"> 190  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="195"> 195  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="200"> 200  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="205"> 205  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="210"> 210  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="215"> 215  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="220"> 220  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="225"> 225  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="230"> 230  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="235"> 235  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="240"> 240  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="245"> 245  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="250"> 250  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="255"> 255  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="260"> 260  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="265"> 265  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="270"> 270  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="275"> 275  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="280"> 280  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="285"> 285  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="290"> 290  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="295"> 295  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="300"> 300  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="305"> 305  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="310"> 310  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="315"> 315  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="320"> 320  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="325"> 325  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="330"> 330  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="335"> 335  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="340"> 340  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="345"> 345  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="350"> 350  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="355"> 355  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="360"> 360  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="365"> 365  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="370"> 370  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="375"> 375  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="380"> 380  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="385"> 385  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="390"> 390  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="395"> 395  {this.props.t("CatalogPage.milimeter")} </option>
                                <option value="400"> 400  {this.props.t("CatalogPage.milimeter")} </option>
                            </select>
                            <select id="height_filter" style={{width: 120}}  onChange={e => this.setState({height_filter_selected: e.target.value})}>
                                <option value="all" selected > {this.props.t("CatalogPage.height")} </option> 
                                <option value="25"> 25 </option>
                                <option value="30"> 30 </option>
                                <option value="35"> 35 </option>
                                <option value="40"> 40 </option>
                                <option value="45"> 45 </option>
                                <option value="50"> 50 </option>
                                <option value="55"> 55 </option>
                                <option value="60"> 60 </option>
                                <option value="65"> 65 </option>
                                <option value="70"> 70 </option>
                                <option value="75"> 75 </option>
                                <option value="80"> 80 </option>
                                <option value="85"> 85 </option>
                                <option value="90"> 90 </option>
                                <option value="95"> 95 </option>
                                <option value="100"> 100 </option>
                            </select>
                            <select id="height_filter" style={{width: 110}}  onChange={e => this.setState({season: e.target.value})} >
                                <option value="season"> {this.props.t("CatalogPage.season")} </option>
                                <option value="summer"> {this.props.t("CatalogPage.summer")} </option>
                                <option value="winter"> {this.props.t("CatalogPage.winter")} </option>
                                <option value="universal"> {this.props.t("CatalogPage.universal")} </option>
                            </select>
                            <button className="c-search-bar__btn c-search-bar__foot" onClick={this.handleSearchProducts}>{this.props.t("CatalogPage.search")}</button>

                            {this.state.apiError1 === true && (
                                <div> 
                                    <h3 style={{color: "red"}}>{this.props.t("Messages.apiError1Message")}  </h3>
                                </div>
                            )}     
                            {this.state.apiError2 === true && (
                                <div> 
                                    <h3 style={{color: "red"}}>{this.props.t("Messages.apiError2Message")}  </h3>
                                </div>
                            )}   
                             {this.state.noProductsErrMessage === true  && (
                                <div> 
                                    <h3 style={{color: "red"}}> {this.props.t("Messages.noProductsErrMessage")} </h3>
                                </div>
                            )} 
                            
                        </div>
                    )}
                 
                   
                </div>
                </div>
                </div>
                
            
                
                 

             

                  
            { this.state.apiError2 === false &&   this.state.products_filtered.length < 1 && (
                <div>
                    
                    <section id="our-program" style={{marginTop:-120}, {marginBottom: 200}}>
                    <div className="container">
                        
                        <div className="top text-center">
                            <h1 style={{color:"#029eb7"}}> {this.props.t("CatalogPage.catalog")} </h1> 
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
                </div>
            )}  


          
            {this.state.products_searched === true && this.state.apiError1 === false && this.state.apiError2 === false && ( 
                <div className="row" >
                    { this.state.products_filtered.map((item, i) => {
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
                                    ) : item.noPrice === true? <span style={{fontSize: 12}}> {this.props.t("CatalogPage.noPrice")} </span>   :  this.state.currencyInUsd ? Math.ceil( Number( item.price) / Number(this.state.currency_rate)) :  item.price}
                                    
                                    
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
        





                        
        <Footer />
    
      </div>
    )
  }

}

export default withTranslation()(Catalog)