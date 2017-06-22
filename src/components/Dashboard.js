import React, { Component } from 'react'
import { Container, Button, Header, List, Input } from 'semantic-ui-react'

class Dashboard extends Component {
  
  componentDidMount() {
    const { fetchMessages } = this.props
    console.log('did mount')
    fetchMessages()
  }
  render() {
    // console.log(this.props)
    const messages = this.props.messages || []
    let text = ''
    return (
      <div>
        <Container>
          <Header>Live Board</Header>
          <Input
          type="text"
          placeholder='Please enter the updating text'
          onChange={(event) => {text = event.target.value;  }} />
          <br/>
          <br/>
          <Button color='red' onClick={() => this.props.deleteAllMessage()}>Remove All</Button>
          <List bulleted>
            {messages.map((m) => 
              <List.Item key={m._id}>
                {m.text} / <Button size='mini' color='red' onClick={() => this.props.deleteMessage(m._id)}>Delete</Button>
                / <Button size='mini' onClick={() => this.props.updateMessage(m._id, text)}>Update</Button> 
              </List.Item>
            )}
          </List>
        </Container>
      </div>
    )
  }
}

export default Dashboard

