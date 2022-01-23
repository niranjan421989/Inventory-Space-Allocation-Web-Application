const Rack = require("../models/rack.model.js");
const Billing = require("../models/billing.model.js");

 

// Retrieve all Tutorials from the database (with condition).
exports.findAll = (req, res) => {

  Rack.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    else res.send(data);
  });
};
exports.findAllBilling = (req, res) => {
Billing.getAll((err, data) => {
    if (err)
	{
	 res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });	
	}
    else 
	{
	 let rackData=[];
	 Rack.getAll((err, subdata) => {
		 rackResult=[];
		 subdata.map( row=> {
			 let rack_array={rack_name:row.rack_name,capcity:row.capcity,capcity_rank:row.capcity_rank,s_r:row.s_r}
			 rackResult.push(rack_array);
		 })
		// console.log("rackResult=",rackResult);
	 let array={};
	 let result=[];
		data.map( (val, index)=> {
		const sku_cubic=Billing.getSkuCubicFit(val.sku);
		const allocate_space=val.quantitiy*sku_cubic;
		
		array={sku:val.sku, quantitiy:val.quantitiy,sku_cubic:sku_cubic,allocate_space:allocate_space}	
		result.push(array);
		})
		//console.log("result=",result);
		//console.log("rackResult=",rackResult);
		const main_result=Rack.allocateSpace(result, rackResult);
		
		res.send({data:main_result});
	 
  });
	 	 
	}
  });	
}
// Find a single Rack by Id
exports.findOne = (req, res) => {
  Rack.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Tutorial with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Tutorial with id " + req.params.id
        });
      }
    } else res.send(data);
  });
};


exports.addproduct = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
const chalan_no=req.body.chalan_no;
const date=req.body.date;
const sku=req.body.sku;
try {
 Billing.findByBillAndSku(req.body, (err, data) => {
    if (err) {
		res.send(err);
		res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Billing."
      });
	}
	else
	{
	if(data==0)
	{
	const billing = new Billing({
    chalan_no: chalan_no,
    date: date,
    sku: sku,
    quantitiy: 1
  });	
  
  // Save Billing in the database
  Billing.create(billing, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Billing."
      });
    else res.send({data:data,'status':'Created'});
  });
  
	}
	else
	{
   try {
	Billing.updateById(data.id, new Billing({quantitiy:(data.quantitiy+1)}),
		 (err, dataa) =>{
		   if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Tutorial with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Tutorial with id " + req.params.id
          });
        }
      } else res.send({data:dataa, 'status':'Updated',maindata:data});  
		 }
		  
		 
  );
	
		} catch (error) {
			res.send(error);
		}

	}
	}
  });
  } catch (error) {
	 res.send(error);  
  }
};
exports.updateorder = (req, res) => {
	if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
   let suss=[];
	const datas=req.body;
	datas.map((data) => {
		 Rack.updateById(data.id, new Rack(data),
		 (err, data) => 
		 {
			 suss.push(data);
		 }
  );
	}
	)
	//console.log(req.body);
	res.send(suss);
};
// Update a Rack identified by the id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  console.log(req.body);

  Rack.updateById(
    req.params.id,
    new Rack(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Tutorial with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Tutorial with id " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};

 
 