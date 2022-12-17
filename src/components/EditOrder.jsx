import React from "react";
import { useEffect, useState } from "react";
import { Container, Form, Button, Card, Row, Col } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { orders_urls, headers } from "../apis/apis";
import { useParams } from "react-router-dom";


const EditOrder = () => {

  const [productInfo, setProductInfo] = useState(null);
  const [orderDescription, setorderDescription] = useState("");
  const [details, setDetails] = useState(null);
  const [product, setProduct] = useState([]);
  const [oldproduct, setOldProduct] = useState([]);
  const [deleted, isDeleted] = useState(false);

  const navigate = useNavigate();
  const [msg, setMsg] = useState({
    text: "",
    color: "",
  });
  const { id } = useParams();

  useEffect(() => {
    getOrderById(id, orders_urls.get_order);
  }, [deleted, id]);

    //get products
    const getProducts = async (url) => {
        try {
          let response = await fetch(url);
          let data = await response.json();
          setProduct(data);
        } catch (error) {
          console.log(error);
        }
      };
    
      useEffect(() => {
        getProducts(orders_urls.get_products);
      }, []);

    //get products of the order    
  const getOrderById = async (id, url) => {
    try {
      console.log(id);
      let response = await fetch(`${url}/${id}`);
      let data = await response.json();
      setDetails(data.order);
      setOldProduct(data.order.products);
      setorderDescription(data.order.orderDesc);
      console.log(data.order.orderDesc);
    } catch (error) {
      console.log(error);
    }
  };
// Setting multiple checkboxes for product
  const handleChange = (e) => {
    const { value, checked } = e.target;
    let obj = { id: value };
    if (checked) {
      setProductInfo([...productInfo, obj]);
    } else {
      setProductInfo([]);
    }
  };

 // form submit for updation 
  const handleSubmit = (e) => {
    e.preventDefault();
    const body = {
      orderDesc: orderDescription,
    };
    const options = {
      headers: { ...headers.write },
      method: "PUT",
      body: JSON.stringify(body),
    };
    
    updateOrder(`${orders_urls.update_order}/${details.id}`, options).then((res) => {
      
        if (res?.error?.messege) {
          setMsg({
            text: res?.error?.messege,
            color: "text-danger",
          });
          
        }else if(res?.msg){
          setMsg({
            text: res?.msg,
            color: "text-success",
          });
          setTimeout(()=> navigate('/'),1000)
        }
      });
  };


//
const updateOrder = async(url,options)=>{
        let response = await fetch(url,options);
        let data = await response.json();
        return data
}
//deleting product from this order
  const deleteProductFromOrder = async (id, p_id) => {
    let body = {
      id: id,
      p_id: p_id,
    };
    let options = {
      headers: { ...headers.write },
      method: "POST",
      body: JSON.stringify(body),
    };
    let url = orders_urls.delete_order_product;
    let response = await fetch(url, options);
    let data = await response.json();
    console.log(data);
    if (data.error) {
      setMsg({
        text: data.error.messege,
        color: "text-danger",
      });
    }
    if (data.msg) {
      setMsg({
        text: data.msg,
        color: "text-success",
      });
    }
   setTimeout(()=>{
    isDeleted((prev)=>{
        return !prev
    })
   },1000)
  };

//adding new product to order  
  const addProductToOrder = async (id, p_id) => {
    let body = {
      id: id,
      products: [{
        id:p_id
      }],
    };
    console.log('ji')
    let options = {
      headers: { ...headers.write },
      method: "POST",
      body: JSON.stringify(body),
    };
    let url = orders_urls.add_order_product;
    let response = await fetch(url, options);
    let data = await response.json();
    console.log(data);
    if (data.error) {
        setMsg({
          text: data.error.messege,
          color: "text-danger",
        });
      }
      if (data.msg) {
        setMsg({
          text: data.msg,
          color: "text-success",
        });
      }
     setTimeout(()=>{
      isDeleted((prev)=>{
          return !prev
      })
     },1000)
  };
  return (
    <>
      <Container>
        <Row className="mt-3">
          <Col lg={6} md={8} sm={12} className="offset-lg-3">
            <Card>
              <Card.Header>
                <h4>Edit Order</h4>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={(e) => handleSubmit(e)}>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="o_desc">Order Description</Form.Label>
                    <Form.Control
                      type="text"
                      name="orderDesc"
                      defaultValue={orderDescription}
                      onChange={(e) => setorderDescription(e.target.value)}
                      placeholder="Enter order description"
                    />
                  </Form.Group>
                  <Form.Label htmlFor="o_desc">
                    <b>Products</b>
                  </Form.Label>
                  <div className="d-flex mb-2">
                    <Form.Select aria-label="Default select example" onChange={(e)=>{addProductToOrder(details.id,e.target.value)}}>
                    <option>Select Product to add</option>
                        {product.length > 0 ? (
                            product.map((item,i)=>(
                                <option key={item.id} value={item.id} >{item.productName} </option>
                            ))
                        ):(
                            <option>No Products</option>
                        )}
                    </Form.Select>
                  </div>
                  {oldproduct.length > 0 ? (
                    oldproduct.map((item, i) => (
                      <Form.Group
                        className="mb-3 border p-2 border-1"
                        key={i + 1}
                      >
                        <Form.Check
                          id={item.id}
                          value={item.id}
                          name="product_id"
                          type="checkbox"
                          onChange={handleChange}
                          label={item.productName}
                          checked={true}
                        />
                        <Form.Label htmlFor="o_desc" className="w-100">
                          <div className="d-flex w-100 justify-content-between">
                            <b>{item.productDescription}</b>
                            <Button
                              className="btn-sm btn-danger"
                              id={item.id}
                              onClick={(e) =>
                                deleteProductFromOrder(details.id, e.target.id)
                              }
                            >
                              Delete
                            </Button>
                          </div>
                        </Form.Label>
                      </Form.Group>
                    ))
                  ) : (
                    <p>{"No Orders Found"}</p>
                  )}
                  <p className={msg.color}>{msg.text}</p>
                  <Button className="mx-2" variant="primary" type="submit">
                    Submit
                  </Button>
                  <Link to="/" className="btn btn-danger">
                    Cancel
                  </Link>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default EditOrder;
