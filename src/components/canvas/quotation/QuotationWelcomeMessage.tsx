
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface QuotationWelcomeMessageProps {
  userRole: string;
}

const QuotationWelcomeMessage: React.FC<QuotationWelcomeMessageProps> = ({ userRole }) => {
  // Generate welcome message based on user role
  const getWelcomeMessage = () => {
    switch (userRole) {
      case "requestor":
        return "Create new quotations for facility services and track their approval status.";
      case "approver":
        return "Review submitted quotations and manage approvals for facility services.";
      case "itAdmin":
        return "Access and manage all quotations including archived ones.";
      case "seniorManagement":
        return "View all quotations and access detailed analytics for facility services.";
      default:
        return "Browse existing quotations or create new ones to get started.";
    }
  };

  return (
    <Alert className="bg-white border-l-4 border-kimyew-blue">
      <Info className="h-4 w-4 text-kimyew-blue" />
      <AlertTitle className="text-kimyew-blue font-medium">
        {userRole === "requestor" ? "Welcome to Quotation Management" 
          : userRole === "approver" ? "Quotation Review Dashboard" 
          : userRole === "itAdmin" ? "Quotation Administration" 
          : "Quotation Overview"}
      </AlertTitle>
      <AlertDescription className="text-sm text-gray-600">
        {getWelcomeMessage()}
      </AlertDescription>
    </Alert>
  );
};

export default QuotationWelcomeMessage;
