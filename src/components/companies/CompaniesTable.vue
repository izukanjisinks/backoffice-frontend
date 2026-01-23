<script setup lang="ts">
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { MoreHorizontal } from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import type { Company } from './types'

defineProps<{
  companies: Company[]
}>()

const emit = defineEmits<{
  (e: 'view', company: Company): void
  (e: 'edit', company: Company): void
  (e: 'delete', company: Company): void
}>()

function getSubscriptionVariant(subscription: Company['subscription']) {
  switch (subscription) {
    case 'enterprise':
      return 'default'
    case 'professional':
      return 'secondary'
    case 'starter':
      return 'outline'
  }
}

function getStatusVariant(status: Company['status']) {
  switch (status) {
    case 'active':
      return 'default'
    case 'inactive':
      return 'destructive'
    case 'pending':
      return 'secondary'
  }
}
</script>

<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Company</TableHead>
        <TableHead>Subscription</TableHead>
        <TableHead>Status</TableHead>
        <TableHead class="text-right">Users</TableHead>
        <TableHead>Created</TableHead>
        <TableHead class="w-[50px]"></TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="company in companies" :key="company.id">
        <TableCell>
          <div class="flex flex-col">
            <span class="font-medium">{{ company.name }}</span>
            <span class="text-sm text-muted-foreground">{{ company.email }}</span>
          </div>
        </TableCell>
        <TableCell>
          <Badge :variant="getSubscriptionVariant(company.subscription)">
            {{ company.subscription }}
          </Badge>
        </TableCell>
        <TableCell>
          <Badge :variant="getStatusVariant(company.status)">
            {{ company.status }}
          </Badge>
        </TableCell>
        <TableCell class="text-right">{{ company.users }}</TableCell>
        <TableCell>{{ company.createdAt }}</TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" size="icon" class="h-8 w-8">
                <MoreHorizontal class="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem @click="emit('view', company)">View details</DropdownMenuItem>
              <DropdownMenuItem @click="emit('edit', company)">Edit</DropdownMenuItem>
              <DropdownMenuItem class="text-destructive" @click="emit('delete', company)">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
