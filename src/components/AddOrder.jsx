import React from "react";
import { useEffect, useState } from "react";
import { Container, Form, Button, Card, Row, Col } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { orders_urls, headers } from "../apis/apis";

const AddOrder = () => {
  const [productInfo, setProductInfo] = useState([]);
  const [orderInfo, setOrderInfo] = useState("");
  const [product, setProduct] = useState([]);
  const navigate = useNavigate();
  const [msg, setMsg] = useState({
    text: "",
    color: "",
  });

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

  //adding order
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(productInfo);
    console.log(orderInfo);
    const body = {
      orderDesc: orderInfo,
      products: productInfo,
    };
    const options = {
      headers: { ...headers.write },
      method: "POST",
      body: JSON.stringify(body),
    };

    addOrder(orders_urls.add_order, options).then((res) => {
      
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
  }  

  const addOrder = async(url,options)=>{
    let response = await fetch(url,options)
    let data = await response.json();
    console.log(data)
    return data
  }

  const handleChange = (e) => {
    const { value, checked } = e.target;
    let obj = { id: value };
    if (checked) {
      setProductInfo([...productInfo, obj]);
    }else{
      setProductInfo([]);
    }
  };

  return (
    <>
      <Container>
        <Row className="mt-3">
          <Col lg={6} md={8} sm={12} className="offset-lg-3">
            <Card>
              <Card.Header>
                <h4>New Order</h4>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={(e) => handleSubmit(e)}>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="o_desc">Order Description</Form.Label>
                    <Form.Control
                      type="text"
                      name="orderDesc"
                      onChange={(e) => setOrderInfo(e.target.value)}
                      placeholder="Enter order description"
                    />
                  </Form.Group>
                  <Form.Label htmlFor="o_desc">
                    <b>Products</b>
                  </Form.Label>
                  {product.length > 0 ? (
                    product.map((item, i) => (
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
                        />
                        <Form.Label htmlFor="o_desc">
                          <b>{item.productDescription}</b>
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

export default AddOrder;
