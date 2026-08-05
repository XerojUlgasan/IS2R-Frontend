import { useState } from "react";
import { createBusiness } from "../api/business.api";

// Submits a new business and owns the submitting/error state.
export function useCreateBusiness() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Creates the business and returns it on success; rethrows on failure.
  const submit = async (payload) => {
    setSubmitting(true);
    setError(null);
    try {
      const data = await createBusiness(payload);
      return data.business;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  return { submit, submitting, error, setError };
}
