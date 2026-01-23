<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { toTypedSchema } from '@vee-validate/zod'
import { Check, Circle, Dot, Building2, CreditCard, UserPlus } from 'lucide-vue-next'
import * as z from 'zod'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Checkbox } from '../ui/checkbox'
import {
  Stepper,
  StepperDescription,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '../ui/stepper'
import type { Company, CompanyFormValues } from './types'

const props = defineProps<{
  open: boolean
  company?: Company | null
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'submit', values: CompanyFormValues): void
}>()

const isEditMode = computed(() => !!props.company)

const initialValues = computed<Partial<CompanyFormValues>>(() => {
  if (!props.company) {
    return { sendWelcomeEmail: true }
  }
  return {
    companyName: props.company.name,
    companyEmail: props.company.email,
    phone: props.company.phone || '',
    website: props.company.website || '',
    industry: props.company.industry || '',
    companySize: props.company.companySize || '',
    subscriptionTier: props.company.subscription,
    billingCycle: props.company.billingCycle || '',
    billingEmail: props.company.billingEmail || '',
    billingAddress: props.company.billingAddress || '',
    billingCity: props.company.billingCity || '',
    billingCountry: props.company.billingCountry || '',
    adminFirstName: props.company.adminFirstName || '',
    adminLastName: props.company.adminLastName || '',
    adminEmail: props.company.adminEmail || '',
    adminPhone: props.company.adminPhone || '',
    adminRole: props.company.adminRole || '',
    sendWelcomeEmail: props.company.sendWelcomeEmail ?? true,
  }
})

// Combined schema for form initialization (all fields)
const combinedSchema = z.object({
  // Step 1: Company Details
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  companyEmail: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  industry: z.string().min(1, 'Please select an industry'),
  companySize: z.string().min(1, 'Please select company size'),
  // Step 2: Subscription & Billing
  subscriptionTier: z.string().min(1, 'Please select a subscription tier'),
  billingCycle: z.string().min(1, 'Please select a billing cycle'),
  billingEmail: z.string().email('Invalid email address'),
  billingAddress: z.string().optional(),
  billingCity: z.string().optional(),
  billingCountry: z.string().optional(),
  // Step 3: Admin Account
  adminFirstName: z.string().min(2, 'First name must be at least 2 characters'),
  adminLastName: z.string().min(2, 'Last name must be at least 2 characters'),
  adminEmail: z.string().email('Invalid email address'),
  adminPhone: z.string().optional(),
  adminRole: z.string().optional(),
  sendWelcomeEmail: z.boolean().default(true),
})

// Per-step field names for validation
const stepFields = [
  ['companyName', 'companyEmail', 'phone', 'website', 'industry', 'companySize'],
  ['subscriptionTier', 'billingCycle', 'billingEmail', 'billingAddress', 'billingCity', 'billingCountry'],
  ['adminFirstName', 'adminLastName', 'adminEmail', 'adminPhone', 'adminRole', 'sendWelcomeEmail'],
]

const stepIndex = ref(1)
const formKey = ref(0)

// Reset form when dialog opens/closes or company changes
watch(() => [props.open, props.company], () => {
  if (props.open) {
    stepIndex.value = 1
    formKey.value++
  }
}, { immediate: true })

const steps = [
  {
    step: 1,
    title: 'Company Details',
    description: 'Basic company information',
    icon: Building2,
  },
  {
    step: 2,
    title: 'Subscription & Billing',
    description: 'Payment and plan setup',
    icon: CreditCard,
  },
  {
    step: 3,
    title: 'Admin Account',
    description: 'Primary admin user',
    icon: UserPlus,
  },
]

const industries = [
  'Technology',
  'Finance',
  'Healthcare',
  'Retail',
  'Manufacturing',
  'Education',
  'Real Estate',
  'Consulting',
  'Other',
]

const companySizes = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '500+', label: '500+ employees' },
]

const subscriptionTiers = [
  { value: 'starter', label: 'Starter', description: 'For small teams' },
  { value: 'professional', label: 'Professional', description: 'For growing businesses' },
  { value: 'enterprise', label: 'Enterprise', description: 'For large organizations' },
]

const billingCycles = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'annually', label: 'Annually (Save 20%)' },
]

const formValidationSchema = toTypedSchema(combinedSchema)

function onSubmit(values: CompanyFormValues) {
  emit('submit', values)
  emit('update:open', false)
  stepIndex.value = 1
}

function handleClose(value: boolean) {
  emit('update:open', value)
  if (!value) {
    stepIndex.value = 1
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="handleClose">
    <DialogContent class="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{{ isEditMode ? 'Edit Company' : 'Create New Company' }}</DialogTitle>
        <DialogDescription>
          {{ isEditMode ? 'Update company details across all sections.' : 'Set up a new company account in 3 easy steps.' }}
        </DialogDescription>
      </DialogHeader>

      <Form
        :key="formKey"
        v-slot="{ meta, values, validate }"
        as=""
        keep-values
        :validation-schema="formValidationSchema"
        :initial-values="initialValues"
      >
        <Stepper
          v-slot="{ isNextDisabled, isPrevDisabled, nextStep, prevStep }"
          v-model="stepIndex"
          class="block w-full"
        >
          <form
            @submit="(e) => {
              e.preventDefault()
              validate()
              if (stepIndex === steps.length && meta.valid) {
                onSubmit(values as CompanyFormValues)
              }
            }"
          >
            <!-- Stepper Header -->
            <div class="flex w-full flex-start gap-2 mb-6">
              <StepperItem
                v-for="step in steps"
                :key="step.step"
                v-slot="{ state }"
                class="relative flex w-full flex-col items-center justify-center"
                :step="step.step"
              >
                <StepperSeparator
                  v-if="step.step !== steps[steps.length - 1].step"
                  class="absolute left-[calc(50%+20px)] right-[calc(-50%+10px)] top-5 block h-0.5 shrink-0 rounded-full bg-muted group-data-[state=completed]:bg-primary"
                />

                <StepperTrigger as-child>
                  <Button
                    :variant="state === 'completed' || state === 'active' ? 'default' : 'outline'"
                    size="icon"
                    class="z-10 rounded-full shrink-0"
                    :class="[state === 'active' && 'ring-2 ring-ring ring-offset-2 ring-offset-background']"
                    :disabled="state !== 'completed' && !meta.valid"
                  >
                    <Check v-if="state === 'completed'" class="size-5" />
                    <Circle v-if="state === 'active'" />
                    <Dot v-if="state === 'inactive'" />
                  </Button>
                </StepperTrigger>

                <div class="mt-2 flex flex-col items-center text-center">
                  <StepperTitle
                    :class="[state === 'active' && 'text-primary']"
                    class="text-xs font-semibold transition"
                  >
                    {{ step.title }}
                  </StepperTitle>
                  <StepperDescription
                    :class="[state === 'active' && 'text-primary']"
                    class="sr-only text-xs text-muted-foreground transition md:not-sr-only"
                  >
                    {{ step.description }}
                  </StepperDescription>
                </div>
              </StepperItem>
            </div>

            <!-- Step 1: Company Details -->
            <div v-if="stepIndex === 1" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <FormField v-slot="{ componentField }" name="companyName">
                  <FormItem class="col-span-2">
                    <FormLabel>Company Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Corporation" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="companyEmail">
                  <FormItem>
                    <FormLabel>Company Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="contact@acme.com" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="phone">
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 000-0000" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="website">
                  <FormItem class="col-span-2">
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://acme.com" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="industry">
                  <FormItem>
                    <FormLabel>Industry *</FormLabel>
                    <Select
                      :model-value="componentField.modelValue"
                      @update:model-value="componentField['onUpdate:modelValue']"
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem v-for="industry in industries" :key="industry" :value="industry">
                          {{ industry }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="companySize">
                  <FormItem>
                    <FormLabel>Company Size *</FormLabel>
                    <Select
                      :model-value="componentField.modelValue"
                      @update:model-value="componentField['onUpdate:modelValue']"
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem v-for="size in companySizes" :key="size.value" :value="size.value">
                          {{ size.label }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
            </div>

            <!-- Step 2: Subscription & Billing -->
            <div v-if="stepIndex === 2" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <FormField v-slot="{ componentField }" name="subscriptionTier">
                  <FormItem>
                    <FormLabel>Subscription Tier *</FormLabel>
                    <Select
                      :model-value="componentField.modelValue"
                      @update:model-value="componentField['onUpdate:modelValue']"
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tier" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem v-for="tier in subscriptionTiers" :key="tier.value" :value="tier.value">
                          <div class="flex flex-col">
                            <span>{{ tier.label }}</span>
                            <span class="text-xs text-muted-foreground">{{ tier.description }}</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="billingCycle">
                  <FormItem>
                    <FormLabel>Billing Cycle *</FormLabel>
                    <Select
                      :model-value="componentField.modelValue"
                      @update:model-value="componentField['onUpdate:modelValue']"
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select cycle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem v-for="cycle in billingCycles" :key="cycle.value" :value="cycle.value">
                          {{ cycle.label }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="billingEmail">
                  <FormItem class="col-span-2">
                    <FormLabel>Billing Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="billing@acme.com" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="billingAddress">
                  <FormItem class="col-span-2">
                    <FormLabel>Billing Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main Street" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="billingCity">
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="New York" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="billingCountry">
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="United States" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
            </div>

            <!-- Step 3: Admin Account -->
            <div v-if="stepIndex === 3" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <FormField v-slot="{ componentField }" name="adminFirstName">
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="John" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="adminLastName">
                  <FormItem>
                    <FormLabel>Last Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="adminEmail">
                  <FormItem class="col-span-2">
                    <FormLabel>Admin Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john.doe@acme.com" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="adminPhone">
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 000-0000" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="adminRole">
                  <FormItem>
                    <FormLabel>Role / Title</FormLabel>
                    <FormControl>
                      <Input placeholder="CEO, CTO, Admin..." v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField v-slot="{ value, handleChange }" name="sendWelcomeEmail">
                  <FormItem class="col-span-2 flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox :checked="value" @update:checked="handleChange" />
                    </FormControl>
                    <div class="space-y-1 leading-none">
                      <FormLabel>Send Welcome Email</FormLabel>
                      <p class="text-sm text-muted-foreground">
                        Send an invitation email to the admin with login instructions.
                      </p>
                    </div>
                  </FormItem>
                </FormField>
              </div>
            </div>

            <!-- Navigation Buttons -->
            <div class="flex items-center justify-between mt-6 pt-4 border-t">
              <Button
                type="button"
                :disabled="isPrevDisabled"
                variant="outline"
                @click="prevStep()"
              >
                Back
              </Button>
              <div class="flex items-center gap-3">
                <Button
                  v-if="stepIndex !== steps.length"
                  :type="meta.valid ? 'button' : 'submit'"
                  :disabled="isNextDisabled"
                  @click="meta.valid && nextStep()"
                >
                  Next
                </Button>
                <Button v-if="stepIndex === steps.length" type="submit">
                  {{ isEditMode ? 'Save Changes' : 'Create Company' }}
                </Button>
              </div>
            </div>
          </form>
        </Stepper>
      </Form>
    </DialogContent>
  </Dialog>
</template>
