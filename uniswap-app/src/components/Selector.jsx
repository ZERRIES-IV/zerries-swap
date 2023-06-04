import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { Dropdown } from 'react-bootstrap'
import {
  COINA,
  COINB,
  COINC,
  DEFAULT_VALUE,
  VENOM,
} from '../../utils/SupportedCoins'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

const Selector = ({ defaultValue, ignoreValue, setToken, id }) => {
  const menu = [
    { key: VENOM, name: VENOM },
    { key: COINA, name: COINA },
    { key: COINB, name: COINB },
    { key: COINC, name: COINC },
  ]

  const [selectedItem, setSelectedItem] = useState()
  const [menuItems, setMenuItems] = useState(getFilteredItems(ignoreValue))

  function getFilteredItems(ignoreValue) {
    return menu.filter(item => item['key'] !== ignoreValue)
  }

  useEffect(() => {
    setSelectedItem(defaultValue)
  }, [defaultValue])

  useEffect(() => {
    setMenuItems(getFilteredItems(ignoreValue))
  }, [ignoreValue])

  return (
    <Dropdown>
      <Dropdown.Toggle
        style={{
          backgroundColor:
            selectedItem === DEFAULT_VALUE ? '#3A3D47' : '#2c2f36',
            borderRadius: '10px', padding: '2px 6px'
        }}
      >
       <div className='flex gap-1'>
        {selectedItem}
        <ChevronDownIcon className='w-[20px] mt-1' />
       </div>
      </Dropdown.Toggle>
      <Dropdown.Menu
        aria-label='Dynamic Actions'
        items={menuItems}
        onClick={key => {
          setSelectedItem(key)
          setToken(key)
        }}
      >
        {item => (
          <Dropdown.Item
            aria-label={id}
            key={item.key}
            color={item.key === 'delete' ? 'error' : 'default'}
          >
            {item.name}
          </Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  )
}

Selector.propTypes = {
  id: PropTypes.string,
  defaultValue: PropTypes.any,
  setToken: PropTypes.func,
  ignoreValue: PropTypes.string
}

export default Selector
