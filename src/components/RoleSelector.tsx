
import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRoundCog, FileText, ClipboardCheck, Shield, Database, BarChart } from "lucide-react";

export type UserRole = "requestor" | "approver" | "itAdmin" | "erpAdmin" | "seniorManagement";

interface RoleSelectorProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ currentRole, onRoleChange }) => {
  const roles: { value: UserRole; label: string; icon: React.ReactNode }[] = [
    { value: "requestor", label: "Requestor", icon: <FileText className="h-4 w-4" /> },
    { value: "approver", label: "Approver", icon: <ClipboardCheck className="h-4 w-4" /> },
    { value: "itAdmin", label: "IT Admin", icon: <Shield className="h-4 w-4" /> },
    { value: "erpAdmin", label: "ERP Admin", icon: <Database className="h-4 w-4" /> },
    { value: "seniorManagement", label: "Senior Management", icon: <BarChart className="h-4 w-4" /> },
  ];

  return (
    <div className="flex items-center gap-2">
      <UserRoundCog className="h-4 w-4 text-kimyew-blue" />
      <Select value={currentRole} onValueChange={(value) => onRoleChange(value as UserRole)}>
        <SelectTrigger className="w-[180px] border-kimyew-blue/30 focus:ring-kimyew-blue/30">
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          {roles.map((role) => (
            <SelectItem key={role.value} value={role.value} className="flex items-center">
              <div className="flex items-center gap-2">
                {role.icon}
                {role.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default RoleSelector;
