import React from 'react'
import {Icon, Container, Button, Header, List, Divider, Accordion} from 'semantic-ui-react'

const TracePanel = ({}) => {
    return [
      (<Accordion.Title>
        <Icon name='dropdown' />
        What is a dog?
      </Accordion.Title>),
      (<Accordion.Content>
        <p>
          A dog is a
        </p>
      </Accordion.Content>)
    ]
}
export default TracePanel
