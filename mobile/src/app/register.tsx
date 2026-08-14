import { Redirect } from 'expo-router';

/** Регистрация только через SMS на экране входа. */
export default function RegisterScreen() {
  return <Redirect href="/login" />;
}
