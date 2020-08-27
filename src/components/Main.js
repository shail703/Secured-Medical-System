import React, { Component } from 'react';

class Main extends Component {

  render() {
    return (
      <div class="container body">
        <h2>Add Medicine</h2>
        <form onSubmit={(event) => {
          event.preventDefault()
          const pat_name = this.patientName.value
          const medi_name = this.medicineName.value
          const price = window.web3.utils.toWei(this.medicinePrice.value.toString(), 'Ether')
          this.props.addMedicine(pat_name,medi_name, price)
        }}>
          <div className="form-group mr-sm-2" id="content">
            <input
              id="patientName"
              type="text"
              ref={(input) => { this.patientName = input }}
              className="form-control"
              placeholder="Patient Name"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="medicineName"
              type="text"
              ref={(input) => { this.medicineName = input }}
              className="form-control"
              placeholder="Medicine Name"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="medicinePrice"
              type="text"
              ref={(input) => { this.medicinePrice = input }}
              className="form-control"
              placeholder="Price"
              required />
          </div>
          <button type="submit" className="btn btn-primary" >Add Medicine</button>
        </form>
        <p> </p>
        
        <h2>Buy Medicine</h2>
        <table className="table">
          <thead>
            <tr id="headings">
              <th scope="col">#</th>
              <th scope="col">Pat_Name</th>
              <th scope="col">Medi_Name</th>
              <th scope="col">Price</th>
              <th scope="col">Owner</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="productList">
          {this.props.patient.map((details,key)=>{
            return(
               <tr key={key}>
              <th id="style" scope="row">{details.id.toString()}</th>
              <td>{details.pat_name}</td>
              <td>{details.medi_name}</td>
              <td>{window.web3.utils.fromWei(details.price.toString(),'Ether')} Eth</td> 
              <td>{details.owner}</td>
              <td>
              {  !details.pruchased
              ? <button   
              name={details.id}
              value={details.price}
               onClick={(event)=>{
                  this.props.purchaseMedicine(event.target.name, event.target.value)
               }}>
               Buy
               </button>
               : null
             }
            
               </td>
            </tr>

              )
          })}
           
          </tbody>
        </table>

      </div>
    );
  }
}

export default Main;