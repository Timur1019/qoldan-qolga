import { useState, useEffect } from 'react'
import { adminApi } from '@/api/admin'
import { DEFAULT_PAGE_SIZE } from '@/shared/ui/UiPagination/pageSizeOptions'

const EMPTY = { email: '', password: '', displayName: '', role: 'USER' }

export default function useAdminUsers() {
  const [page, setPage] = useState(0)
  const [size, setSizeState] = useState(DEFAULT_PAGE_SIZE)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)
  const [blockModal, setBlockModal] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')

  const load = (nextPage = page, nextSize = size) => {
    setLoading(true)
    setError('')
    adminApi
      .getUsers({ page: nextPage, size: nextSize, sort: 'createdAt,desc' })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load(page, size)
  }, [page, size])

  const setSize = (next) => {
    setSizeState(next)
    setPage(0)
  }

  const patchForm = (part) => setForm((prev) => ({ ...prev, ...part }))

  const createUser = (e) => {
    e?.preventDefault?.()
    setCreating(true)
    setCreateError('')
    adminApi
      .createUser(form)
      .then(() => {
        setForm(EMPTY)
        setFormOpen(false)
        setPage(0)
        load(0, size)
      })
      .catch((err) => setCreateError(err.message))
      .finally(() => setCreating(false))
  }

  const updateUser = (user, patch) => {
    setUpdatingId(user.id)
    adminApi
      .updateUser(user.id, patch)
      .then(() => setData((prev) => updateUserInPage(prev, user.id, patch)))
      .catch((e) => setError(e.message))
      .finally(() => setUpdatingId(null))
  }

  return {
    page,
    setPage,
    size,
    setSize,
    data,
    loading,
    error,
    updatingId,
    blockModal,
    setBlockModal,
    formOpen,
    setFormOpen,
    form,
    patchForm,
    creating,
    createError,
    createUser,
    updateUser,
  }
}

function updateUserInPage(prev, id, patch) {
  if (!prev?.content) return prev
  return {
    ...prev,
    content: prev.content.map((u) => (u.id === id ? { ...u, ...patch } : u)),
  }
}
