import React from 'react'
import { Card, ListGroup, Button, ListGroupItem } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import './product-list.css'

export const ProductList = ({ data }) => {
  
  const renderList = () => {
    return data.map((el) => {
      return (
        <Card key={el.id} style={{ width: '18rem' }}>
          <Card.Img variant="top" src={el.imageUrl} />
          <Card.Body>
            <Card.Title>{el.name}</Card.Title>
            <Card.Text>
              {el.description.length > 100
                ? el.description.slice(0, 100) + '...'
                : el.description}
            </Card.Text>
            <ListGroup className="list-group-flush">
              <ListGroupItem>Count: {el.count}</ListGroupItem>
              <ListGroupItem>Weight {el.weight}</ListGroupItem>
            </ListGroup>
            <Button>
              <NavLink to={`${el.id}`} style={{ color: 'white' }}>
                Go to product Item
              </NavLink>
            </Button>
          </Card.Body>
        </Card>
      )
    })
  }
  return (
    <div className="product-list">
      {data ? renderList() : `You haven't any product`}
    </div>
  )
}
