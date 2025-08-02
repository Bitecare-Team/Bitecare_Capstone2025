import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Staff = () => {
  const staffData = [
    { 
      id: 1, 
      fullname: 'Maria Santos', 
      position: 'Nurse', 
      email: 'maria@abtc.com', 
      contact_number: '09171234567', 
      status: 'active', 
      role: 'staff' 
    },
    { 
      id: 2, 
      fullname: 'Juan Dela Cruz', 
      position: 'Admin', 
      email: 'juan@abtc.com', 
      contact_number: '09999888888', 
      status: 'active', 
      role: 'admin' 
    }
  ];

  return (
    <div className="content-section">
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        margin: '20px'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: '700',
            color: '#1f2937'
          }}>
            List of Staff
          </h2>
          <button style={{
            padding: '10px 20px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}>
            <span style={{ fontSize: '16px' }}>+</span>
            Add New
          </button>
        </div>

        {/* Staff Table */}
        <div style={{
          overflowX: 'auto'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '14px'
          }}>
            <thead>
              <tr style={{
                backgroundColor: '#3b82f6',
                color: 'white'
              }}>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>
                  ID
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>
                  Full Name
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>
                  Position
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>
                  Email
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>
                  Contact Number
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>
                 
                  Status
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>
                  Role
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {staffData.map((staff) => (
                <tr key={staff.id} style={{
                  borderBottom: '1px solid #f3f4f6',
                  backgroundColor: 'white'
                }}>
                  <td style={{
                    padding: '16px',
                    color: '#374151',
                    fontSize: '14px'
                  }}>
                    {staff.id}
                  </td>
                  <td style={{
                    padding: '16px',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    {staff.fullname}
                  </td>
                  <td style={{
                    padding: '16px',
                    color: '#374151',
                    fontSize: '14px'
                  }}>
                    {staff.position}
                  </td>
                  <td style={{
                    padding: '16px',
                    color: '#374151',
                    fontSize: '14px'
                  }}>
                    {staff.email}
                  </td>
                  <td style={{
                    padding: '16px',
                    color: '#374151',
                    fontSize: '14px'
                  }}>
                    {staff.contact_number}
                  </td>
                  <td style={{
                    padding: '16px',
                    color: '#374151',
                    fontSize: '14px'
                  }}>
                    <span style={{
                      backgroundColor: staff.status === 'active' ? '#10b981' : '#ef4444',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {staff.status}
                    </span>
                  </td>
                  <td style={{
                    padding: '16px',
                    color: '#374151',
                    fontSize: '14px'
                  }}>
                    {staff.role}
                  </td>
                  <td style={{
                    padding: '16px'
                  }}>
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center'
                    }}>
                      <button style={{
                        padding: '6px 10px',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <FaEdit size={12} />
                      </button>
                      <button style={{
                        padding: '6px 10px',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '20px',
          color: '#6b7280',
          fontSize: '14px'
        }}>
          Showing 1 to 2 of 2 entries
        </div>
      </div>
    </div>
  );
};

export default Staff; 