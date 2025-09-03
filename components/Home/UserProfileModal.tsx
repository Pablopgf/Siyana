'use client'

import { useFrame } from '@/components/farcaster-provider'
import { FaTimes, FaUser, FaEnvelope, FaMapMarkerAlt, FaChevronRight, FaArrowLeft } from 'react-icons/fa'
import { useState, useEffect } from 'react'

interface UserProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { context } = useFrame()
  const [email, setEmail] = useState('user@example.com')
  const [showAddresses, setShowAddresses] = useState(false)
  const [showNewAddress, setShowNewAddress] = useState(false)
  const [addresses, setAddresses] = useState<Array<{
    name: string
    lastName: string
    address: string
    flatNumber: string
    state: string
    city: string
    postCode: string
    prefix: string
    mobile: string
  }>>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    address: '',
    flatNumber: '',
    state: '',
    city: '',
    postCode: '',
    prefix: '',
    mobile: ''
  })
  const [errors, setErrors] = useState<{[key: string]: boolean}>({})

  useEffect(() => {
    if (isOpen) {
      const savedEmail = localStorage.getItem('userEmail')
      if (savedEmail) setEmail(savedEmail)

      const savedAddresses = localStorage.getItem('userAddresses')
      if (savedAddresses) {
        try {
          const parsedAddresses = JSON.parse(savedAddresses)
          setAddresses(parsedAddresses)
        } catch (error) {
          console.error('Error parsing saved addresses:', error)
        }
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const user = context?.user

  const handleSave = () => {
    localStorage.setItem('userEmail', email)
    onClose()
  }

  const handleNewAddressSave = () => {
    const newErrors: {[key: string]: boolean} = {}
    
    const requiredFields = ['name', 'address', 'state', 'city', 'postCode']
    requiredFields.forEach(field => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = true
      }
    })
    
    if (Object.keys(newErrors).length === 0) {
      if (editingIndex !== null) {
        // Editing existing address
        const updatedAddresses = [...addresses]
        updatedAddresses[editingIndex] = { ...formData }
        setAddresses(updatedAddresses)
        localStorage.setItem('userAddresses', JSON.stringify(updatedAddresses))
        setEditingIndex(null)
      } else {
        // Adding new address
        const newAddress = { ...formData }
        setAddresses(prev => [...prev, newAddress])
        localStorage.setItem('userAddresses', JSON.stringify([...addresses, newAddress]))
      }
      
      setShowNewAddress(false)
      setShowAddresses(true)
      setFormData({
        name: '',
        lastName: '',
        address: '',
        flatNumber: '',
        state: '',
        city: '',
        postCode: '',
        prefix: '',
        mobile: ''
      })
      setErrors({})
    } else {
      setErrors(newErrors)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }))
    }
  }

  const handleEditAddress = (index: number) => {
    setEditingIndex(index)
    setFormData(addresses[index])
    setShowAddresses(false)
    setShowNewAddress(true)
  }

  if (showNewAddress) {
    return (
      <div className="fixed inset-0 bg-white z-50">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xs font-bold text-gray-800">
              {editingIndex !== null ? 'EDIT ADDRESS' : 'NEW ADDRESS'}
            </h2>
            <button 
              onClick={() => setShowNewAddress(false)}
              className="text-black hover:text-gray-700 text-xs"
            >
              <FaArrowLeft size={16} />
            </button>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">NAME</p>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full p-2 border text-xs ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded`}
                  placeholder="Enter name"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">This field is mandatory.</p>}
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">LAST NAME</p>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full p-2 border text-xs border-gray-300 rounded"
                  placeholder="Enter last name"
                />
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">ADDRESS</p>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={`w-full p-2 border text-xs ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded`}
                  placeholder="Enter address"
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">This field is mandatory.</p>}
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">FLAT NUMBER AND/OR LETTER</p>
                <input
                  type="text"
                  value={formData.flatNumber}
                  onChange={(e) => handleInputChange('flatNumber', e.target.value)}
                  className="w-full p-2 border text-xs border-gray-300 rounded"
                  placeholder="Enter flat number/letter"
                />
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">STATE</p>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className={`w-full p-2 border text-xs ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded`}
                  placeholder="Enter state"
                />
                {errors.state && <p className="text-red-500 text-xs mt-1">This field is mandatory.</p>}
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">CITY</p>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className={`w-full p-2 border text-xs ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded`}
                  placeholder="Enter city"
                />
                {errors.city && <p className="text-red-500 text-xs mt-1">This field is mandatory.</p>}
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">POST CODE</p>
                <input
                  type="text"
                  value={formData.postCode}
                  onChange={(e) => handleInputChange('postCode', e.target.value)}
                  className={`w-full p-2 border text-xs ${errors.postCode ? 'border-red-500' : 'border-gray-300'} rounded`}
                  placeholder="Enter post code"
                />
                {errors.postCode && <p className="text-red-500 text-xs mt-1">This field is mandatory.</p>}
              </div>

              <div className="flex space-x-2">
                <div className="w-1/3">
                  <p className="text-xs text-gray-500 mb-1">PREFIX</p>
                  <input
                    type="text"
                    value={formData.prefix}
                    onChange={(e) => handleInputChange('prefix', e.target.value)}
                    className="w-full p-2 border text-xs border-gray-300 rounded"
                    placeholder="+1"
                  />
                </div>
                <div className="w-2/3">
                  <p className="text-xs text-gray-500 mb-1">MOBILE</p>
                  <input
                    type="text"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    className="w-full p-2 border text-xs border-gray-300 rounded"
                    placeholder="Enter mobile number"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t">
            <button
              onClick={handleNewAddressSave}
              className="w-full bg-white text-black border border-black py-3 px-4 hover:bg-gray-100 transition-colors font-semibold text-xs"
            >
              SAVE
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (showAddresses) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white w-full h-full max-w-none max-h-none overflow-y-auto">
          <div className="p-4 border-gray-200">
            <button 
              onClick={() => setShowAddresses(false)}
              className="text-black hover:text-gray-700 text-xs mb-4"
            >
              <FaArrowLeft size={16} />
            </button>
            <div className="border-b border-gray-200 pb-2">
              <h2 className="text-xs font-bold text-gray-800">ADDRESSES</h2>
            </div>
          </div>

          <div className="p-6">
            {addresses.length > 0 ? (
              <div className="space-y-3 mb-4">
                {addresses.map((address, index) => (
                  <div 
                    key={index} 
                    className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleEditAddress(index)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-800">
                          {address.name} {address.lastName}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {address.address}
                          {address.flatNumber && `, ${address.flatNumber}`}
                        </p>
                        <p className="text-xs text-gray-600">
                          {address.city}, {address.state} {address.postCode}
                        </p>
                        {address.mobile && (
                          <p className="text-xs text-gray-600 mt-1">
                            {address.prefix && `${address.prefix} `}{address.mobile}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 text-center py-4 mb-4">
                No addresses saved yet
              </p>
            )}
            
            <button
              onClick={() => {
                setEditingIndex(null)
                setFormData({
                  name: '',
                  lastName: '',
                  address: '',
                  flatNumber: '',
                  state: '',
                  city: '',
                  postCode: '',
                  prefix: '',
                  mobile: ''
                })
                setErrors({})
                setShowNewAddress(true)
              }}
              className="w-full bg-white text-black border border-black py-3 px-4 hover:bg-gray-100 transition-colors font-semibold text-xs"
            >
              ADD NEW ADDRESS
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full h-full max-w-none max-h-none overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
          <h2 className="text-xs font-bold text-gray-800">Profile</h2>
          <button 
            onClick={onClose}
            className="text-xl"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {user ? (
            <div className="space-y-6">
              <div className="flex flex-col items-center text-center">
                {user.pfpUrl && (
                  <img
                    src={user.pfpUrl}
                    alt="Profile Picture"
                    className="w-24 h-24 rounded-full border-4 border-gray-200 mb-4"
                  />
                )}
                <h3 className="text-xs font-bold text-gray-800 mb-2">
                  {user.displayName || 'Usuario Farcaster'}
                </h3>
                <p className="text-xs text-gray-600">
                  @{user.username}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FaEnvelope className="text-blue-500" size={16} />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Email</p>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="text-xs font-semibold text-gray-800 bg-transparent border-none outline-none w-full"
                      placeholder="Enter email"
                    />
                  </div>
                </div>

                <div 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => setShowAddresses(true)}
                >
                  <div className="flex items-center space-x-3">
                    <FaMapMarkerAlt className="text-green-500" size={16} />
                    <div>
                      <p className="text-xs text-gray-500">ADDRESSES</p>
                    </div>
                  </div>
                  <FaChevronRight className="text-gray-400" size={14} />
                </div>
              </div>

              <button
                onClick={handleSave}
                className="w-full bg-black text-white py-3 px-4 hover:bg-gray-800 transition-colors font-semibold text-xs"
              >
                SAVE
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <FaUser className="text-gray-400 mx-auto mb-4" size={48} />
              <p className="text-xs text-gray-500">No hay información de usuario disponible</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 