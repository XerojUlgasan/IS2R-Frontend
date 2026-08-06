import { useState } from "react";
import {
  createMaterial,
  updateMaterial,
  deleteMaterial,
  addMaterialStock,
} from "../api/material.api";

// Small helper: wraps one async action with submitting/error state.
function useSubmitter(action) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (...args) => {
    setSubmitting(true);
    setError(null);
    try {
      return await action(...args);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  return { submit, submitting, error, setError };
}

// Creates a material and returns the created record.
export function useCreateMaterial(businessId) {
  const { submit, ...rest } = useSubmitter((payload) => createMaterial(businessId, payload));
  const create = async (payload) => {
    const data = await submit(payload);
    return data.material;
  };
  return { create, ...rest };
}

// Updates a material's name/type/unit and returns the updated record.
export function useUpdateMaterial() {
  const { submit, ...rest } = useSubmitter((id, payload) => updateMaterial(id, payload));
  const update = async (id, payload) => {
    const data = await submit(id, payload);
    return data.material;
  };
  return { update, ...rest };
}

// Deletes a material by id.
export function useDeleteMaterial() {
  const { submit, ...rest } = useSubmitter((id) => deleteMaterial(id));
  const remove = async (id) => {
    await submit(id);
  };
  return { remove, ...rest };
}

// Adds stock (quantity + mfg_price) and returns the updated record.
export function useAddStock() {
  const { submit, ...rest } = useSubmitter((id, payload) => addMaterialStock(id, payload));
  const addStock = async (id, payload) => {
    const data = await submit(id, payload);
    return data.material;
  };
  return { addStock, ...rest };
}
