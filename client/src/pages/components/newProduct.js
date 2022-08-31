
import React, {Component } from 'react' 
import Button from '@material-ui/core/Button';  
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';  
import TextField from '@material-ui/core/TextField';    
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem'; 
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select'; 
import CircularProgress from '@material-ui/core/CircularProgress';   
import Checkbox from '@material-ui/core/Checkbox';    
import FormControlLabel from '@material-ui/core/FormControlLabel';  
import axios from 'axios';
import { Alert } from '@material-ui/lab';  

export default class CreateRecord extends Component{
   
    constructor(props) {
        super(props)
        
        this.state = { 

            loading: false,
            apiIssue: false,
            product_codes: [],

            brand: '',
            other_brand: '',
            price: 0,
            inSale: false,
            disscountPrice: 0,
            condition: 'new',
            season: 'universal',
            diameter: 'R12',
            width: '145',
            height: '25',
            code: '', 
            noPrice: false,

            brand_error: '',
            other_brand_error: '',
            price_error: '',
            disscountPrice_error: '',
            diameter_error: '',
            width_error: '',
            height_error:'', 
            code_error: '',

            image_error: '',
            previewSource: '',
            fileInputState: '',
            selectedFile: '', 
            successMsg: '',
            errMsg: ''
           
        }
    }
 
   
    // Close
    closeForm = () => {
        this.props.close()
    } 
 
  
    // Validations 
    validate = () => {
        let isError = false

        const errors = {
            brand_error : '',
            other_brand_error: '',
            price_error: '',
            disscountPrice_error: '', 
            code_error: '',
            image_error: ''
        }

        
        // Code
        let current_code = this.state.code.toString().replace(/ /g,'')
        if(current_code === ''){
            isError = true
            errors.code_error = 'კოდი დამატება აუცილებელია'
        }
        if(this.state.product_codes.includes(current_code)){
            isError = true
            errors.code_error = 'პროდუქტი მსგავსი კოდით უკვე არსებობს'
        }

        // Brand
        if(this.state.brand === '' ){
            isError = true
            errors.brand_error = 'ბრენდის არჩევა აუცილებელია'
        }
        if(this.state.brand === 'other' && this.state.other_brand.toString().replace(/ /g,'') === ''){
            isError = true
            errors.other_brand_error = 'ახალი ბრენდის დამატება აუცილებელია'
        } 

        // Price 
        if(this.state.noPrice === false && this.state.price < 1){
            isError = true
            errors.price_error = 'შეიყვანეთ ფასი ან მონიშნეთ ფასი შეთანხმებით'
        }

         // Disscount price 
         if(this.state.inSale === true && this.state.disscountPrice < 1){
            isError = true
            errors.disscountPrice_error = 'ფასდაკლების ფასის დამატება აუცილებელია'
        }

        
        if(this.state.inSale === true && parseInt(this.state.disscountPrice) >= parseInt(this.state.price)){
            isError = true
            errors.disscountPrice_error = 'ფასი უნდა აღემატებოდეს ფასდაკლების ფასს'
        }

        //Image 
        if(!this.state.selectedFile){
            isError = true
            errors.image_error = 'სურათის ატვირთვა აუცილებელია'
        }

        this.setState({ 
            code_error: errors.code_error, 
            brand_error: errors.brand_error,
            other_brand_error: errors.other_brand_error,
            price_error : errors.price_error,
            disscountPrice_error: errors.disscountPrice_error,
            image_error: errors.image_error
          
           
        }) 
        return isError
    }
 
    async componentDidMount(){
        let product_codes = []
        for(let i of this.props.products){
            product_codes.push(i.code)
        }

        console.log('product_codes', product_codes)
        this.setState({product_codes: product_codes})
    }



    // Create
    handleCreate  = async (imageUrl) => { 
        const err = this.validate() 
        if (!err) { 

            this.setState({ loading: true })
            let _brand = this.state.brand === 'other' ? this.state.other_brand : this.state.brand
            let _size = this.state.diameter + '/' + this.state.width + '/' + this.state.height
           
          
            let reqObj  = {
                img_url: imageUrl.toString(),
                brand: _brand, 
                noPrice: this.state.noPrice,
                price: this.state.price,
                inSale: this.state.inSale,
                disscountPrice: this.state.disscountPrice,
                condition: this.state.condition,
                season: this.state.season,
                size: _size,
                code: this.state.code
            }

            await axios
            .post('/api/products/create', reqObj)
            .then(res => {
                if(res.status === 200){
                    this.props.updateProducts()
                    this.props.showSuccessAlert('create')
                }else{
                    this.setState({apiIssue: true, loading: false})
                }
            })
            console.log('REQ OBJ: ', reqObj)
        } 
    }


    uploadImage = async (base64EncodedImage) => {
        console.log('----------------------------')
        console.log('SENDING:', base64EncodedImage)
        try { 
            await axios
            .post('/api/products/upload', { data: base64EncodedImage })
            .then(res => {
                if(res.status === 200){
                    if(res.data.succeed){ 
                        console.log('FILE UPLOAD RES DATA:', res.data)
                        this.handleCreate(res.data.url)
                    }else{
                        this.setState({errMsg: "სურათის ატვირთვისას მოხდა შეცდომა, სცადეთ ხელახლა", loading: false})
                    } 
                }else{
                    this.setState({errMsg: "სურათის ატვირთვისას მოხდა შეცდომა, სცადეთ ხელახლა", loading: false})
                }
            }) 
        } catch (err) {
            console.error(err)
            this.setState({errMsg: "სურათის ატვირთვისას მოხდა შეცდომა, სცადეთ ხელახლა", loading: false})
        }
    }



    previewFile = (file) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            this.setState({previewSource: reader.result}) 
        }
      
    }

     handleFileInputChange = (e) => {
        const file = e.target.files[0]
        this.previewFile(file)  
        this.setState({selectedFile: file, image_error: ''})
        this.setState({fileInputState: e.target.value}) 
    } 


    handleSubmitFile = () => {
        const err = this.validate() 
        if (!err) { 
            this.setState({loading: true})
            const err = this.validate() 
            if (!err) {  
                if (!this.state.selectedFile) return
                const reader = new FileReader()
                reader.readAsDataURL(this.state.selectedFile)
                reader.onloadend = () => {
                    this.uploadImage(reader.result)
                }
                reader.onerror = () => { 
                    this.setState({errMsg: "სურათის ატვირთვისას მოხდა შეცდომა, სცადეთ ხელახლა", loading: false})
                }
            }
        }
      
    }

 
    render(){
        return (
            <div  > 
                <DialogContent> 
                     
                        
                        <TextField
                            style={{width: 390, marginTop: 30}}
                            autoFocus
                            margin="dense"
                            id="name"
                            label="კოდი *"
                            type="text"
                            variant="outlined"
                            value={this.state.code}
                            onChange={event => {
                                if( event.target.value.length){
                                    this.setState({
                                        code: event.target.value,
                                        code_error: ''
                                    }) 
                                }else{
                                    this.setState({
                                        code: event.target.value 
                                    }) 
                                }  
                            }}
                            fullWidth
                            helperText={this.state.code_error}
                            error={this.state.code_error.length}
                        />  
                        <br/>
                        <FormControl   style={{width: this.state.brand === 'other' ?  90: 390,  marginTop: 15}} >
                            <InputLabel id="lbl-format">ბრენდი *</InputLabel>
                            <Select
                            
                                labelId="lbl-format"
                                id="format"
                                value={this.state.brand}
                                onChange={(event) => {this.setState({brand:event.target.value, brand_error: '', other_brand_error: '' }) }  }
                                label="Format"
                            > 
                                <MenuItem value="Maxtrek" style={{color: "black"}}>Maxtrek</MenuItem>
                                <MenuItem value="Bearway" style={{color: "black"}}>Bearway</MenuItem> 
                                <MenuItem value="other" style={{color: "black"}}>სხვა</MenuItem> 
                            </Select>
                        </FormControl>
                        {this.state.brand_error.length > 0 && (
                            <h6 style={{color:"red"}} >{this.state.brand_error}</h6>
                        )}
                        {this.state.brand === 'other' && (
                             <TextField
                                style={{width: 280, marginTop: 27, marginLeft:10}} 
                                margin="dense"
                                id="name"
                                label="სხვა ბრენდი *"
                                type="text"
                                variant="outlined"
                                value={this.state.other_brand}
                                onChange={event => {
                                    if( event.target.value.length){
                                        this.setState({
                                            other_brand: event.target.value,
                                            other_brand_error: ''
                                        }) 
                                    }else{
                                        this.setState({
                                            other_brand: event.target.value 
                                        }) 
                                    }  
                                }}
                                fullWidth
                                helperText={this.state.other_brand_error}
                                error={this.state.other_brand_error.length}
                            />
                        )}
                        <FormControl   style={{width: 124,marginLeft:20, marginTop: 15}} >
                            <InputLabel id="lbl-format">დიამეტრი</InputLabel>
                            <Select
                            
                                labelId="lbl-format"
                                id="format"
                                value={this.state.diameter}
                                onChange={(event) => {this.setState({diameter:event.target.value }) }  }
                                label="Format"
                            > 
                                <MenuItem value="R12" style={{color: "black"}}>R 12</MenuItem> 
                                <MenuItem value="R13" style={{color: "black"}}>R 13</MenuItem> 
                                <MenuItem value="R14" style={{color: "black"}}>R 14</MenuItem> 
                                <MenuItem value="R15" style={{color: "black"}}>R 15</MenuItem> 
                                <MenuItem value="R16" style={{color: "black"}}>R 16</MenuItem> 
                                <MenuItem value="R17" style={{color: "black"}}>R 17</MenuItem> 
                                <MenuItem value="R18" style={{color: "black"}}>R 18</MenuItem> 
                                <MenuItem value="R19" style={{color: "black"}}>R 19</MenuItem> 
                                <MenuItem value="R20" style={{color: "black"}}>R 20</MenuItem> 
                                <MenuItem value="R21" style={{color: "black"}}>R 21</MenuItem> 
                                <MenuItem value="R22" style={{color: "black"}}>R 22</MenuItem> 
                                <MenuItem value="R23" style={{color: "black"}}>R 23</MenuItem> 
                                <MenuItem value="R24" style={{color: "black"}}>R 24</MenuItem> 
                                <MenuItem value="R25" style={{color: "black"}}>R 25</MenuItem> 
                                <MenuItem value="R26" style={{color: "black"}}>R 26</MenuItem> 
                                <MenuItem value="R27" style={{color: "black"}}>R 27</MenuItem>
                                <MenuItem value="R12C" style={{color: "black"}}>R 12 C</MenuItem> 
                                <MenuItem value="R13C" style={{color: "black"}}>R 13 C</MenuItem> 
                                <MenuItem value="R14C" style={{color: "black"}}>R 14 C</MenuItem> 
                                <MenuItem value="R15C" style={{color: "black"}}>R 15 C</MenuItem> 
                                <MenuItem value="R16C" style={{color: "black"}}>R 16 C</MenuItem> 
                                <MenuItem value="R17C" style={{color: "black"}}>R 17 C</MenuItem> 
                                <MenuItem value="R18C" style={{color: "black"}}>R 18 C</MenuItem> 
                                <MenuItem value="R19C" style={{color: "black"}}>R 19 C</MenuItem> 
                                <MenuItem value="R20C" style={{color: "black"}}>R 20 C</MenuItem> 
                                <MenuItem value="R21C" style={{color: "black"}}>R 21 C</MenuItem> 
                                <MenuItem value="R22C" style={{color: "black"}}>R 22 C</MenuItem> 
                                <MenuItem value="R23C" style={{color: "black"}}>R 23 C</MenuItem> 
                                <MenuItem value="R24C" style={{color: "black"}}>R 24 C</MenuItem> 
                                <MenuItem value="R25C" style={{color: "black"}}>R 25 C</MenuItem> 
                                <MenuItem value="R26C" style={{color: "black"}}>R 26 C</MenuItem> 
                                <MenuItem value="R27C" style={{color: "black"}}>R 27 C</MenuItem>  
                            </Select>
                        </FormControl>
                        <FormControl   style={{width: 124,marginLeft:7, marginTop: 15}} >
                            <InputLabel id="lbl-format">სიგანე</InputLabel>
                            <Select
                            
                                labelId="lbl-format"
                                id="format"
                                value={this.state.width}
                                onChange={(event) => {this.setState({width:event.target.value }) }  }
                                label="Format"
                            > 
                                <MenuItem value="145" style={{color: "black"}}>145</MenuItem>
                                <MenuItem value="150" style={{color: "black"}}>150</MenuItem>
                                <MenuItem value="155" style={{color: "black"}}>155</MenuItem>
                                <MenuItem value="160" style={{color: "black"}}>160</MenuItem>
                                <MenuItem value="165" style={{color: "black"}}>165</MenuItem>
                                <MenuItem value="170" style={{color: "black"}}>170</MenuItem>
                                <MenuItem value="175" style={{color: "black"}}>175</MenuItem>
                                <MenuItem value="180" style={{color: "black"}}>180</MenuItem>
                                <MenuItem value="185" style={{color: "black"}}>185</MenuItem>
                                <MenuItem value="190" style={{color: "black"}}>190</MenuItem>
                                <MenuItem value="195" style={{color: "black"}}>195</MenuItem>
                                <MenuItem value="200" style={{color: "black"}}>200</MenuItem>
                                <MenuItem value="205" style={{color: "black"}}>205</MenuItem>
                                <MenuItem value="210" style={{color: "black"}}>210</MenuItem>
                                <MenuItem value="215" style={{color: "black"}}>215</MenuItem>
                                <MenuItem value="220" style={{color: "black"}}>220</MenuItem>
                                <MenuItem value="225" style={{color: "black"}}>225</MenuItem>
                                <MenuItem value="230" style={{color: "black"}}>230</MenuItem>
                                <MenuItem value="235" style={{color: "black"}}>235</MenuItem>
                                <MenuItem value="240" style={{color: "black"}}>240</MenuItem>
                                <MenuItem value="245" style={{color: "black"}}>245</MenuItem>
                                <MenuItem value="250" style={{color: "black"}}>250</MenuItem>
                                <MenuItem value="255" style={{color: "black"}}>255</MenuItem>
                                <MenuItem value="260" style={{color: "black"}}>260</MenuItem>
                                <MenuItem value="265" style={{color: "black"}}>265</MenuItem>
                                <MenuItem value="270" style={{color: "black"}}>270</MenuItem>
                                <MenuItem value="275" style={{color: "black"}}>275</MenuItem>
                                <MenuItem value="280" style={{color: "black"}}>280</MenuItem>
                                <MenuItem value="285" style={{color: "black"}}>285</MenuItem>
                                <MenuItem value="290" style={{color: "black"}}>290</MenuItem>
                                <MenuItem value="295" style={{color: "black"}}>295</MenuItem>
                                <MenuItem value="300" style={{color: "black"}}>300</MenuItem>
                                <MenuItem value="305" style={{color: "black"}}>305</MenuItem>
                                <MenuItem value="310" style={{color: "black"}}>310</MenuItem>
                                <MenuItem value="315" style={{color: "black"}}>315</MenuItem>
                                <MenuItem value="320" style={{color: "black"}}>320</MenuItem>
                                <MenuItem value="325" style={{color: "black"}}>325</MenuItem>
                                <MenuItem value="330" style={{color: "black"}}>330</MenuItem>
                                <MenuItem value="335" style={{color: "black"}}>335</MenuItem>
                                <MenuItem value="340" style={{color: "black"}}>340</MenuItem>
                                <MenuItem value="345" style={{color: "black"}}>345</MenuItem>
                                <MenuItem value="350" style={{color: "black"}}>350</MenuItem>
                                <MenuItem value="355" style={{color: "black"}}>355</MenuItem>
                                <MenuItem value="360" style={{color: "black"}}>360</MenuItem>
                                <MenuItem value="365" style={{color: "black"}}>365</MenuItem>
                                <MenuItem value="370" style={{color: "black"}}>370</MenuItem>
                                <MenuItem value="375" style={{color: "black"}}>375</MenuItem>
                                <MenuItem value="380" style={{color: "black"}}>380</MenuItem>
                                <MenuItem value="385" style={{color: "black"}}>385</MenuItem>
                                <MenuItem value="390" style={{color: "black"}}>390</MenuItem>
                                <MenuItem value="395" style={{color: "black"}}>395</MenuItem>
                                <MenuItem value="400" style={{color: "black"}}>400</MenuItem>
                               
                            </Select>
                        </FormControl>
                        <FormControl   style={{width: 124,marginLeft:7, marginTop: 15}} >
                            <InputLabel id="lbl-format">სიმაღლე</InputLabel>
                            <Select
                            
                                labelId="lbl-format"
                                id="format"
                                value={this.state.height}
                                onChange={(event) => {this.setState({height:event.target.value }) }  }
                                label="Format"
                            > 
                                <MenuItem value="25" style={{color: "black"}}>25</MenuItem>
                                <MenuItem value="30" style={{color: "black"}}>30</MenuItem>
                                <MenuItem value="35" style={{color: "black"}}>35</MenuItem>
                                <MenuItem value="40" style={{color: "black"}}>40</MenuItem>
                                <MenuItem value="45" style={{color: "black"}}>45</MenuItem>
                                <MenuItem value="50" style={{color: "black"}}>50</MenuItem>
                                <MenuItem value="55" style={{color: "black"}}>55</MenuItem>
                                <MenuItem value="60" style={{color: "black"}}>60</MenuItem>
                                <MenuItem value="65" style={{color: "black"}}>65</MenuItem>
                                <MenuItem value="70" style={{color: "black"}}>70</MenuItem>
                                <MenuItem value="75" style={{color: "black"}}>75</MenuItem>
                                <MenuItem value="80" style={{color: "black"}}>80</MenuItem>
                                <MenuItem value="85" style={{color: "black"}}>85</MenuItem>
                                <MenuItem value="90" style={{color: "black"}}>90</MenuItem>
                                <MenuItem value="95" style={{color: "black"}}>95</MenuItem>
                                <MenuItem value="100" style={{color: "black"}}>100</MenuItem> 
                               
                            </Select>
                        </FormControl>
                        <br/>
 
                        <FormControl   style={{width: 390, marginTop: 40}} >
                            <InputLabel id="lbl-format">მდგომარეობა</InputLabel>
                            <Select 
                                labelId="lbl-format"
                                id="format"
                                value={this.state.condition}
                                onChange={(event) => {this.setState({condition:event.target.value }) }  }
                                label="Format"
                            > 
                                <MenuItem value="new" style={{color: "black"}}>ახალი</MenuItem>
                                <MenuItem value="secondary" style={{color: "black"}}>მეორადი</MenuItem>  
                            </Select>
                        </FormControl>
                        
                        <FormControl   style={{width: 390, marginTop: 40, marginLeft:20}} >
                            <InputLabel id="lbl-format">სეზონი</InputLabel>
                            <Select 
                                labelId="lbl-format"
                                id="format"
                                value={this.state.season}
                                onChange={(event) => {this.setState({season:event.target.value }) }  }
                                label="Format"
                            > 
                                <MenuItem value="universal" style={{color: "black"}}>უნივერსალი</MenuItem>
                                <MenuItem value="summer" style={{color: "black"}}>ზაფხული</MenuItem>  
                                <MenuItem value="winter" style={{color: "black"}}>ზამთარი</MenuItem>  
                            </Select>
                        </FormControl>

                        <br/>
                        <FormControlLabel 
                            style={{marginTop:25}}
                            control={
                                <Checkbox 
                                    checked={this.state.noPrice}
                                    onChange={e =>  {
                                        this.setState({
                                            noPrice : e.target.checked,
                                            price_error: '', disscountPrice_error: '',
                                            inSale: false}) 
                                    }}
                                    name="noPrice"
                                    color="primary"
                                />
                            }
                            label="ფასი შეთანხმებით"
                        />
                        <FormControlLabel 
                            style={{marginTop:25}}
                            control={
                                <Checkbox 
                                    checked={this.state.inSale}
                                    onChange={e =>  {
                                        this.setState({inSale : e.target.checked}) 
                                    }}
                                    disabled={this.state.noPrice === true}
                                    name="sale"
                                    color="primary"
                                />
                            }
                            label="ფასდაკლება"
                        />
                        <br/>
                        <TextField
                                style={{width: 390, marginTop: 30 }}   
                                id="standard-number"
                                label="ფასი *"
                                type="number" 
                                disabled={this.state.noPrice === true}
                                variant="outlined"
                                inputProps={{ min: "0" }} 
                                value={ parseInt(this.state.price) > 0 ? parseInt(this.state.price) : ''}
                                InputLabelProps={{ shrink: true,  }}
                                onChange={event => {
                                    if( event.target.value.length){
                                        this.setState({
                                            price: event.target.value,
                                            price_error: ''
                                            
                                        }) 
                                    }else{
                                        this.setState({
                                            price: event.target.value 
                                        }) 
                                    }  
                                }}
                                fullWidth
                                helperText={this.state.price_error}
                                error={this.state.price_error.length}
                        />  
                        {this.state.inSale === true && (
                            <TextField
                                style={{width: 390, marginLeft:20, marginTop: 30 }}   
                                id="standard-number"
                                label="ფასდაკლებული ფასი"
                                type="number" 
                                variant="outlined"
                                inputProps={{ min: "0" }} 
                                value={ parseInt(this.state.disscountPrice) > 0 ? parseInt(this.state.disscountPrice) : ''}
                                InputLabelProps={{ shrink: true,  }}
                                disabled={this.state.inSale === false}
                                onChange={event => {
                                    if( event.target.value.length){
                                        this.setState({
                                            disscountPrice: event.target.value,
                                            disscountPrice_error: '' 
                                        }) 
                                    }else{
                                        this.setState({
                                            disscountPrice: event.target.value 
                                        }) 
                                    }  
                                }}
                                fullWidth
                                helperText={this.state.disscountPrice_error}
                                error={this.state.disscountPrice_error.length}
                            />  
                        )}
                        <div style={{width: 800}}> <hr/></div>


                        {/* FILE UPLOAD  */}
                        <div style={{marginTop: 40}}>
                            <h3 className="title">სურათის ატვირთვა</h3> 
                            <form   className="form">
                                <input
                                    id="fileInput"
                                    type="file"
                                    name="image"
                                    onChange={this.handleFileInputChange}
                                    value={this.fileInputState}
                                    className="form-input"
                                /> 
                            </form>

                            {this.state.previewSource.length > 0 && (
                                <img
                                    src={this.state.previewSource}
                                    alt="chosen" 
                                    style={{marginTop:30}}
                                />
                            )} 
                            {this.state.image_error.length > 0 && (
                                  <Alert style={{width: 500, marginTop: 20}} severity="error">{this.state.image_error}</Alert>
                            )}
                             {this.state.errMsg.length > 0 && ( 
                                <Alert style={{width: 500, marginTop: 20}} severity="error">{this.state.errMsg}</Alert>
                            )}
                        </div>
                                   
                    
                    {this.state.apiIssue && (
                        <div style={{ marginTop:20}}> 
                            <div style={{ marginBottom:20}}>
                                <p style={{color: "red"}}>ვერ მოხდა ბაზასთან დაკავშირება, სცადეთ მოგვიანებით</p>
                            </div> 
                        </div>
                    )}
                    {this.state.apiIssue === false && (
                        <div style={{ marginBottom:40}}></div>
                    )}
                   
                </DialogContent> 
                <br/>
                 
                <DialogActions> 
                    <Button 
                            onClick={this.closeForm} 
                            color="primary"
                            variant="outlined"
                            disabled={this.state.loading}
                    >
                        გაუქმება
                    </Button>
                   
                    {this.state.loading && ( 
                        <CircularProgress   thickness="5" right="10%" size="2.5rem"/> 
                    )}
                    {!this.state.loading && (
                      <Button  
                            variant="contained" 
                            color="primary"
                            onClick={  this.handleSubmitFile } 
                            disabled={this.state.loading} 
                        >
                        დამატება    
                    </Button>
                    )}
                </DialogActions>
            </div>
        )
    }
}