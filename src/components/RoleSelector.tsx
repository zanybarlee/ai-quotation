
import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRoundCog } from "lucide-react";

export type UserRole = "requestor" | "approver" | "itAdmin" | "erpAdmin" | "seniorManagement";

interface RoleSelectorProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ currentRole, onRoleChange }) => {
  const roles: { value: UserRole; label: string }[] = [
    { value: "requestor", label: "Requestor" },
    { value: "approver", label: "Approver" },
    { value: "itAdmin", label: "IT Admin" },
    { value: "erpAdmin", label: "ERP Admin" },
    { value: "seniorManagement", label: "Senior Management" },
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
            <SelectItem key={role.value} value={role.value}>
              {role.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default RoleSelector;
