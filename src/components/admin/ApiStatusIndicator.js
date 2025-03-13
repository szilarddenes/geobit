import React from 'react';
import { FiCheckCircle, FiAlertCircle, FiHelpCircle } from 'react-icons/fi';

const ApiStatusIndicator = ({ title, status, message, details }) => {
  // Determine status icon and color based on status
  const getStatusConfig = () => {
    switch (status) {
      case 'ok':
        return {
          icon: <FiCheckCircle size={22} className="text-green-500" />,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-700'
        };
      case 'warning':
        return {
          icon: <FiAlertCircle size={22} className="text-amber-500" />,
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          textColor: 'text-amber-700'
        };
      case 'error':
        return {
          icon: <FiAlertCircle size={22} className="text-red-500" />,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-700'
        };
      default:
        return {
          icon: <FiHelpCircle size={22} className="text-gray-500" />,
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-600'
        };
    }
  };

  const { icon, bgColor, borderColor, textColor } = getStatusConfig();

  const renderQuotaInfo = () => {
    if (!details) return null;
    
    if (details.quota) {
      const percentUsed = (details.quota.used / details.quota.limit) * 100;
      return (
        <div className="mt-2">
          <div className="flex justify-between text-xs mb-1">
            <span>{percentUsed.toFixed(1)}% used</span>
            <span>{details.quota.used} / {details.quota.limit}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${percentUsed > 80 ? 'bg-red-500' : percentUsed > 50 ? 'bg-amber-500' : 'bg-green-500'}`}
              style={{ width: `${percentUsed}%` }}
            ></div>
          </div>
        </div>
      );
    }
    
    if (details.usage) {
      return (
        <div className="mt-2 text-xs space-y-1">
          <div className="flex justify-between">
            <span>Reads:</span>
            <span className="font-medium">{details.usage.reads}</span>
          </div>
          <div className="flex justify-between">
            <span>Writes:</span>
            <span className="font-medium">{details.usage.writes}</span>
          </div>
          <div className="flex justify-between">
            <span>Deletes:</span>
            <span className="font-medium">{details.usage.deletes}</span>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className={`${bgColor} border ${borderColor} rounded-lg p-4`}>
      <div className="flex items-start gap-3">
        <div className="mt-1">{icon}</div>
        <div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className={`text-sm ${textColor}`}>{message}</p>
          {renderQuotaInfo()}
        </div>
      </div>
    </div>
  );
};

export default ApiStatusIndicator;