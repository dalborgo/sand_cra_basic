import React, { Component } from 'react'
import JSONInput from 'react-json-editor-ajrm/index';
import locale from 'react-json-editor-ajrm/locale/en';

const sampleData = {
  miao: 12,
}
class App3 extends Component {
  render () {
    /**
     * Rendering this JSONInput component with some properties
     */
    return (
      <div style={{ maxWidth: '1400px', maxHeight: '100%' }}>
        <JSONInput
          colors={
            {
              string: '#DAA520', // overrides theme colors with whatever color value you want
            }
          } // data to display
          height="550px"
          locale={locale}
          placeholder={sampleData}
          theme="light_mitsuketa_tribute"
        />
      </div>
    )
  }
}

export default App3

