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
  const [showChangeEmail, setShowChangeEmail] = useState(false)
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
    prefix: '+34',
    mobile: ''
  })
  const [errors, setErrors] = useState<{[key: string]: boolean}>({})
  const [newEmail, setNewEmail] = useState('')
  const [previousEmail, setPreviousEmail] = useState('')
  const [emailError, setEmailError] = useState(false)

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
        prefix: '+34',
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

  const handleOpenChangeEmail = () => {
    setPreviousEmail(email)
    setNewEmail('')
    setEmailError(false)
    setShowChangeEmail(true)
  }

  const handleSaveNewEmail = () => {
    if (newEmail) {
      setEmail(newEmail)
      localStorage.setItem('userEmail', newEmail)
      setNewEmail('')
      setEmailError(false)
      setShowChangeEmail(false)
    } else {
      setEmailError(true)
    }
  }

  if (showNewAddress) {
    return (
      <div className="fixed inset-0 bg-white z-50">
        <div className="flex flex-col h-full">
          <div className="p-4 pb-8">
            <button 
              onClick={() => setShowNewAddress(false)}
              className="text-black text-xl pb-8"
            >
              ×
            </button>
            <h2 className="text-black text-xs">
              {editingIndex !== null ? 'EDIT ADDRESS' : 'NEW ADDRESS'}
            </h2>
          </div>

          <div className="flex-1 px-4 overflow-y-auto">
            <div className="space-y-6">
              <div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full pb-1 border-b text-xs text-black ${errors.name ? 'border-red-500' : 'border-gray-300'} bg-transparent outline-none`}
                  placeholder="NAME"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">This field is mandatory.</p>}
              </div>

              <div>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full pb-1 border-b text-xs text-black border-gray-300 bg-transparent outline-none"
                  placeholder="LAST NAME"
                />
              </div>

              <div>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={`w-full pb-1 border-b text-xs text-black ${errors.address ? 'border-red-500' : 'border-gray-300'} bg-transparent outline-none`}
                  placeholder="ADDRESS"
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">This field is mandatory.</p>}
              </div>

              <div>
                <input
                  type="text"
                  value={formData.flatNumber}
                  onChange={(e) => handleInputChange('flatNumber', e.target.value)}
                  className="w-full pb-1 border-b text-xs text-black border-gray-300 bg-transparent outline-none"
                  placeholder="FLAT NUMBER AND/OR LETTER"
                />
              </div>

              <div>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className={`w-full pb-1 border-b text-xs text-black ${errors.state ? 'border-red-500' : 'border-gray-300'} bg-transparent outline-none`}
                  placeholder="STATE"
                />
                {errors.state && <p className="text-red-500 text-xs mt-1">This field is mandatory.</p>}
              </div>

              <div>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className={`w-full pb-1 border-b text-xs text-black ${errors.city ? 'border-red-500' : 'border-gray-300'} bg-transparent outline-none`}
                  placeholder="CITY"
                />
                {errors.city && <p className="text-red-500 text-xs mt-1">This field is mandatory.</p>}
              </div>

              <div>
                <input
                  type="text"
                  value={formData.postCode}
                  onChange={(e) => handleInputChange('postCode', e.target.value)}
                  className={`w-full pb-1 border-b text-xs text-black ${errors.postCode ? 'border-red-500' : 'border-gray-300'} bg-transparent outline-none`}
                  placeholder="POST CODE"
                />
                {errors.postCode && <p className="text-red-500 text-xs mt-1">This field is mandatory.</p>}
              </div>

              <div className="flex space-x-2">
                <div className="w-1/3">
                  <p className="text-xs text-gray-500">PREFIX</p>
                  <input
                    type="text"
                    value={formData.prefix}
                    onChange={(e) => handleInputChange('prefix', e.target.value)}
                    className="w-full pb-1 border-b text-xs text-black border-gray-300 bg-transparent outline-none"
                    placeholder="+34"
                  />
                </div>
                <div className="w-2/3">
                  <p className="text-xs text-transparent">Texto invisible</p>
                  <input
                    type="text"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    className="w-full pb-1 border-b text-xs text-black border-gray-300 bg-transparent outline-none"
                    placeholder="MOBILE"
                  />
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={handleNewAddressSave}
                  className="w-full bg-white border border-black py-3 px-4 hover:bg-gray-100 transition-colors text-xs text-black"
                >
                  SAVE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showAddresses) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white w-full h-full max-w-none max-h-none overflow-y-auto">
          <div className="p-4 pb-8">
            <button 
              onClick={() => setShowAddresses(false)}
              className="text-black text-xl pb-8"
            >
              ×
            </button>
            <div>
              <h2 className="text-black text-xs">ADDRESSES</h2>
            </div>
          </div>

          <div className="px-4">
            {addresses.length > 0 && (
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
                  prefix: '+34',
                  mobile: ''
                })
                setErrors({})
                setShowNewAddress(true)
              }}
              className="w-1/2 bg-white border border-black py-3 px-4 hover:bg-gray-100 text-black text-xs"
            >
              ADD NEW ADDRESS
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (showChangeEmail) {
    return (
      <div className="fixed inset-0 bg-white z-50">
        <div className="flex flex-col h-full">
          <div className="p-4 pb-8">
            <button 
              onClick={() => setShowChangeEmail(false)}
              className="text-black text-xl pb-8"
            >
              ×
            </button>
            <h2 className="text-black text-xs">CHANGE EMAIL</h2>
            <p className="text-black text-xs mt-2">Your current login email is: {email}</p>
          </div>

          <div className="flex-1 px-4 overflow-y-auto">
            <div className="space-y-4">
              <div>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => {
                    setNewEmail(e.target.value)
                    if (emailError) setEmailError(false)
                  }}
                  className={`w-full pb-1 border-b text-black text-xs ${emailError ? 'border-red-500' : 'border-gray-300'} bg-transparent outline-none`}
                  placeholder="NEW EMAIL"
                />
                {emailError && (
                  <div className="flex items-center mt-1">
                    <div className="w-4 h-4 rounded-full bg-white border border-red-500 flex items-center justify-center mr-1">
                      <span className="text-red-500 text-xs font-bold">!</span>
                    </div>
                    <p className="text-red-500 text-xs">This field is mandatory</p>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <button
                  onClick={handleSaveNewEmail}
                  className="w-1/2 bg-white border border-black py-3 px-4 hover:bg-gray-100 transition-colors text-black text-xs"
                >
                  CHANGE EMAIL
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full h-full max-w-none max-h-none overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-2">
          <h2 className="text-black text-xs">PROFILE</h2>
          <button 
            onClick={onClose}
            className="text-black text-xl"
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
                  {user.displayName}
                </h3>
                <p className="text-xs text-gray-600">
                  @{user.username}
                </p>
              </div>

              <div className="space-y-4">
                <div 
                  className="flex items-center justify-between pt-4 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => setShowAddresses(true)}
                >
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="text-black text-xs">ADDRESSES</p>
                    </div>
                  </div>
                  <FaChevronRight size={12} />
                </div>

                <div 
                  className="flex items-center justify-between pt-4 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={handleOpenChangeEmail}
                >
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="text-black text-xs">EMAIL</p>
                      <p className="text-gray-600 text-xs mt-1">{email}</p>
                    </div>
                  </div>
                  <FaChevronRight size={12} />
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-8">
              <FaUser className="text-gray-400 mx-auto mb-4" size={48} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 