import React from "react";

import TableComponent from "./utils/TableComponent";
import { useState, useEffect } from "react";
import { Card, Col, Container, Row} from "react-bootstrap";
import SearchBar from "./utils/SearchBar";
import { Link } from "react-router-dom";
import { orders_urls, headers } from "../apis/apis";

const Home = () => {

  const t_heading = [
    "Order Id",
    "Order Description",
    "Count of Products",
    "Created Date",
  ];

  const [order, setOrder] = useState([]);
  const [filter, setFilter] = useState([]);
  const [msg, setMsg] = useState({
    text: "",
    color: "",
  });
  const [deleted,isDeleted] = useState(false)

  //fetching order data
  const fetchOrder = async (url)=>{

    let response = await fetch(url,headers.read);
    let data = await response.json()

    setOrder(data.orders)
    if (data.error) {
        setMsg({
          text: data.error.messege,
          color: "text-muted text-center",
        });
      }
      if (data.msg) {
        setMsg({
          text: data.msg,
          color: "text-success text-center",
        });
      }
      setTimeout(()=>{
        setMsg({
            text:'',
            color:''
        })
       },1000)
  }

  useEffect(() => {
    fetchOrder(orders_urls.get_orders)
  },[deleted])

//filter order by search value
const filterOrder = (orders,data)=>{
    return orders.filter(item => String(item.id).includes(data.toLowerCase()) || item.orderDescription.toLowerCase().includes(data.toLowerCase().trim()))
 }
 
  const getSearchQuery = (data)=>{
    let filtered = []
     filtered = filterOrder(order,data)
     if(data.length ===0){
        setMsg({
            text:'',
            color:'' 
        })
     }
     if(filtered.length === 0){
        setMsg({
            text:'No Orders Found',
            color:'text-muted text-center'
        })
     }else{
        setFilter(filtered)
     }
     
  }

 //delete order
  const deleteOrder = async(id)=>{
    const options = {
        headers:{...headers.write},
        method:'DELETE'
    }
    let response =  await fetch(`${orders_urls.delete_order}/${id}`,options)
    let data = await response.json()
    if (data.error) {
        setMsg({
          text: data.error.messege,
          color: "text-danger text-center",
        });
      }
      if (data.msg) {
        setMsg({
          text: data.msg,
          color: "text-success text-center",
        });
      }
    setTimeout(()=>{
        isDeleted((prev)=>{
            return !prev
        })
        setMsg({
            text:'',
            color:''
        })
       },1000)
  } 

  
  
  return (
    <>
      <Container>
        <Row className="my-4">
            
          <Col lg={12} md={12} sm={12}>
            <Card>
              <Card.Header>
                <Row>
                  <Col lg={6} md={6} sm={6}>
                    <h4>Order Management</h4>
                  </Col>
                  <Col lg={4} md={4} sm={4}>
                  <SearchBar getSearchQuery={getSearchQuery} />
                  </Col>
                  <Col lg={2} md={2} sm={2}>
                    <Link to='/add/order' className="btn btn-primary">Add Order</Link>
                  </Col>
                </Row>
              </Card.Header>

              <Card.Body>
              <p className={msg.color}>{msg.text}</p>
                {
                   filter.length > 0 ? <TableComponent t_heading={t_heading} orders={filter} deleteOrder={deleteOrder} /> : <TableComponent t_heading={t_heading} orders={order} deleteOrder={deleteOrder} />
                }
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
