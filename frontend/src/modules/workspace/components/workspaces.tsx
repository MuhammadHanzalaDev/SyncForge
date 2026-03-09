"use client";
import { useWorkspaces } from "@/modules/workspace/queries/workspace.query";
import { useEffect } from "react";

const Workspaces = () => {
  const { data, isLoading, error } = useWorkspaces();

  useEffect(() => {
  }, [data, isLoading, error])

  return <div>workspaces</div>;
};

export default Workspaces;
