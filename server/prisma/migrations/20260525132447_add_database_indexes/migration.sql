-- CreateIndex
CREATE INDEX "Application_status_idx" ON "Application"("status");

-- CreateIndex
CREATE INDEX "Application_createdAt_idx" ON "Application"("createdAt");

-- CreateIndex
CREATE INDEX "Application_updatedAt_idx" ON "Application"("updatedAt");

-- CreateIndex
CREATE INDEX "Craftsman_status_idx" ON "Craftsman"("status");

-- CreateIndex
CREATE INDEX "Craftsman_categoryId_idx" ON "Craftsman"("categoryId");

-- CreateIndex
CREATE INDEX "Craftsman_serviceId_idx" ON "Craftsman"("serviceId");

-- CreateIndex
CREATE INDEX "Craftsman_queueOrder_idx" ON "Craftsman"("queueOrder");

-- CreateIndex
CREATE INDEX "Craftsman_isAvailable_idx" ON "Craftsman"("isAvailable");

-- CreateIndex
CREATE INDEX "Review_userId_idx" ON "Review"("userId");

-- CreateIndex
CREATE INDEX "Review_craftsmanId_idx" ON "Review"("craftsmanId");

-- CreateIndex
CREATE INDEX "Review_taskId_idx" ON "Review"("taskId");

-- CreateIndex
CREATE INDEX "Review_createdAt_idx" ON "Review"("createdAt");

-- CreateIndex
CREATE INDEX "Task_status_idx" ON "Task"("status");

-- CreateIndex
CREATE INDEX "Task_customerId_idx" ON "Task"("customerId");

-- CreateIndex
CREATE INDEX "Task_craftsmanId_idx" ON "Task"("craftsmanId");

-- CreateIndex
CREATE INDEX "Task_categoryId_idx" ON "Task"("categoryId");

-- CreateIndex
CREATE INDEX "Task_serviceId_idx" ON "Task"("serviceId");

-- CreateIndex
CREATE INDEX "Task_createdAt_idx" ON "Task"("createdAt");

-- CreateIndex
CREATE INDEX "Task_scheduledDate_idx" ON "Task"("scheduledDate");

-- CreateIndex
CREATE INDEX "TaskAssignment_taskId_idx" ON "TaskAssignment"("taskId");

-- CreateIndex
CREATE INDEX "TaskAssignment_craftsmanId_idx" ON "TaskAssignment"("craftsmanId");

-- CreateIndex
CREATE INDEX "TaskAssignment_status_idx" ON "TaskAssignment"("status");

-- CreateIndex
CREATE INDEX "TaskAssignment_assignedAt_idx" ON "TaskAssignment"("assignedAt");

-- CreateIndex
CREATE INDEX "TaskReassignmentRequest_taskId_idx" ON "TaskReassignmentRequest"("taskId");

-- CreateIndex
CREATE INDEX "TaskReassignmentRequest_status_idx" ON "TaskReassignmentRequest"("status");

-- CreateIndex
CREATE INDEX "TaskReassignmentRequest_oldCraftsmanId_idx" ON "TaskReassignmentRequest"("oldCraftsmanId");

-- CreateIndex
CREATE INDEX "TaskReassignmentRequest_newCraftsmanId_idx" ON "TaskReassignmentRequest"("newCraftsmanId");

-- CreateIndex
CREATE INDEX "Warning_craftsmanId_idx" ON "Warning"("craftsmanId");

-- CreateIndex
CREATE INDEX "Warning_createdAt_idx" ON "Warning"("createdAt");
