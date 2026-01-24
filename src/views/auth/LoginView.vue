<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Building2 } from 'lucide-vue-next'
import { useUiStore } from '../../stores/ui.store'
import logoDark from '../../assets/logo/HexaPrime-DarkMode.png'
import logoLight from '../../assets/logo/HexaPrime-LightMode.png'
import loginImage from '../../assets/images/login.png'
import sysLogo from '../../assets/images/sys-logo.png'

const router = useRouter()
const uiStore = useUiStore()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const error = ref('')

async function handleLogin() {
  error.value = ''

  if (!email.value || !password.value) {
    error.value = 'Please enter both email and password'
    return
  }

  isLoading.value = true

  try {
    // TODO: Implement actual authentication logic here
    // For now, just simulate a login
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Simulate successful login
    localStorage.setItem('isAuthenticated', 'true')
    router.push('/dashboard')
  } catch (err) {
    error.value = 'Invalid email or password'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen w-full flex items-center justify-center p-4 bg-muted/40">
    <Card class="w-full max-w-5xl overflow-hidden">
      <CardContent class="grid p-0 md:grid-cols-2">
        <!-- Login Form -->
        <form class="p-8 md:p-10 flex flex-col justify-center" @submit.prevent="handleLogin">
          <div class="flex flex-col gap-6">
            <!-- Header -->
            <div class="flex flex-col items-center gap-2 text-center">
              <div class="">
                <img :src="sysLogo" alt="System Logo">
              </div>
              <h1 class="text-3xl font-bold tracking-tight">
                Welcome Back
              </h1>
              <p class="text-muted-foreground text-balance">
                Sign in to your back-office account
              </p>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p class="text-sm text-destructive text-center">{{ error }}</p>
            </div>

            <!-- Form Fields -->
            <div class="space-y-4">
              <div class="space-y-2">
                <Label for="email">Email</Label>
                <Input
                  id="email"
                  v-model="email"
                  type="email"
                  placeholder="admin@example.com"
                  required
                  autocomplete="email"
                />
              </div>

              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <Label for="password">Password</Label>
                  <a
                    href="#"
                    class="text-sm text-primary underline-offset-4 hover:underline"
                    @click.prevent
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  v-model="password"
                  type="password"
                  required
                  autocomplete="current-password"
                />
              </div>

              <Button type="submit" class="w-full" :disabled="isLoading">
                {{ isLoading ? 'Signing in...' : 'Sign In' }}
              </Button>
            </div>

            <!-- Footer -->
            <p class="text-xs text-center text-muted-foreground px-8">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
            <div class="flex items-center justify-center gap-2 px-8">
              <img
                :src="uiStore.isDarkMode ? logoDark : logoLight"
                alt="Hexa-Prime"
                class="h-6 w-auto opacity-60"
              />
              <p class="text-xs text-muted-foreground font-semibold">
                Powered by Hexa-Prime
              </p>
            </div>
          </div>
        </form>

        <!-- Image Side -->
        <div class="relative hidden md:block">
          <div class="absolute inset-0 ">
            <div class="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
              <div class="space-y-4 max-w-md">
                
                <img :src="loginImage" alt="">

              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
