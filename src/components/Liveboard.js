import React, { Component } from 'react'
import { Button, Header, List } from 'semantic-ui-react'
import WordCloud from 'react-d3-cloud'

class Liveboard extends Component {
  
  componentDidMount() {
    const { fetchMessages } = this.props
    console.log('did mount')
    fetchMessages()
  }
  render() {
    // console.log(this.props)
    const messages = this.props.messages || []

const data = [
  { text: 'Hey', value: 1000 },
  { text: 'lol', value: 200 },
  { text: 'first impression', value: 800 },
  { text: 'very cool', value: 1000000 },
  { text: 'duck', value: 10 },
];

const randomBetween = (lower, upper) => Math.floor(Math.random() * upper) + lower 
// const fontSizeMapper = word => Math.log2(word.value) * 5;
const fontSizeMapper = word => Math.log2(randomBetween(30, 600)) * 5
const rotate = word => randomBetween(0,60)
// const rotate = word => word.value % 360;

    return (
      <div>
        <Header>Live Board</Header>
        <List bulleted>
          {messages.map((m) => <List.Item key={m._id}>{m.text}</List.Item>)}
        </List>

      </div>
    )
  }
}

export default Liveboard

