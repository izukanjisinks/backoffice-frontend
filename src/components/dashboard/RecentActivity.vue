<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Badge } from '../ui/badge'

const activities = [
  {
    id: 1,
    user: 'John Doe',
    initials: 'JD',
    action: 'approved',
    target: 'Acme Corp onboarding',
    time: '2 minutes ago',
  },
  {
    id: 2,
    user: 'Jane Smith',
    initials: 'JS',
    action: 'created',
    target: 'New subscription tier',
    time: '1 hour ago',
  },
  {
    id: 3,
    user: 'Mike Johnson',
    initials: 'MJ',
    action: 'updated',
    target: 'Company profile',
    time: '3 hours ago',
  },
  {
    id: 4,
    user: 'Sarah Wilson',
    initials: 'SW',
    action: 'rejected',
    target: 'Beta Inc request',
    time: '5 hours ago',
  },
]

function getBadgeVariant(action: string) {
  switch (action) {
    case 'approved':
      return 'default'
    case 'rejected':
      return 'destructive'
    case 'created':
      return 'secondary'
    default:
      return 'outline'
  }
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Recent Activity</CardTitle>
      <CardDescription>Latest actions across the system</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="space-y-4">
        <div
          v-for="activity in activities"
          :key="activity.id"
          class="flex items-center gap-4"
        >
          <Avatar class="h-9 w-9">
            <AvatarFallback>{{ activity.initials }}</AvatarFallback>
          </Avatar>
          <div class="flex-1 space-y-1">
            <p class="text-sm font-medium leading-none">
              {{ activity.user }}
              <Badge :variant="getBadgeVariant(activity.action)" class="ml-2">
                {{ activity.action }}
              </Badge>
            </p>
            <p class="text-sm text-muted-foreground">{{ activity.target }}</p>
          </div>
          <div class="text-sm text-muted-foreground">{{ activity.time }}</div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
