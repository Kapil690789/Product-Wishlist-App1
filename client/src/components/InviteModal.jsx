"use client"

import { useState } from "react"
import toast from "react-hot-toast"
import "../styles/Modal.css"

const InviteModal = ({ wishlistId, onClose }) => {
  const [email, setEmail] = useState("")
  const [invitedEmails, setInvitedEmails] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleAddEmail = () => {
    if (!email.trim()) {
      return
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address")
      return
    }

    if (invitedEmails.includes(email)) {
      toast.error("This email has already been added")
      return
    }

    setInvitedEmails([...invitedEmails, email])
    setEmail("")
  }

  const handleRemoveEmail = (emailToRemove) => {
    setInvitedEmails(invitedEmails.filter((email) => email !== emailToRemove))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (invitedEmails.length === 0) {
      toast.error("Please add at least one email to invite")
      return
    }

    setIsLoading(true)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:5001/api/wishlists/${wishlistId}/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          emails: invitedEmails,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(`Invitation${invitedEmails.length > 1 ? "s" : ""} sent successfully!`)
        onClose()
      } else {
        toast.error(data.message || "Failed to send invitations")
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Invite Friends</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="email-input-group">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="friend@example.com"
              />
              <button type="button" className="add-email-button" onClick={handleAddEmail}>
                Add
              </button>
            </div>
          </div>

          {invitedEmails.length > 0 && (
            <div className="invited-emails">
              <label>Invited Friends</label>
              <div className="email-chips">
                {invitedEmails.map((email, index) => (
                  <div key={index} className="email-chip">
                    <span>{email}</span>
                    <button type="button" className="remove-email" onClick={() => handleRemoveEmail(email)}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="invite-note">
            Note: This is a mock invitation. In a real app, invitees would receive an email with a link to join.
          </p>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={isLoading || invitedEmails.length === 0}>
              {isLoading ? "Sending..." : "Send Invitations"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default InviteModal
