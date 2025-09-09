# Event Management System Workflow

## 📋 Complete Workflow Overview

This document outlines the complete workflow for the OTP-based event management system, showing how users can create, manage, edit, and delete events securely.

## 🔄 Main Workflow Diagram

```mermaid
graph TB
    A[User Visits Homepage] --> B{What does user want?}
    
    B -->|Browse Events| C[Events Page]
    B -->|Create Event| D[Create Event Flow]
    B -->|Manage Event| E[Event Management Flow]
    
    C --> C1[View Event List]
    C1 --> C2[Filter/Search Events]
    C2 --> C3[Click Event Details]
    C3 --> C4[Event Detail Page]
    C4 --> C5[Register for Event]
    
    D --> D1[Start: Creator Information]
    D1 --> D2[Step 1: Enter Email]
    D2 --> D3[Step 2: Basic Info]
    D3 --> D4[Step 3: Date & Location]
    D4 --> D5[Step 4: Pricing & Capacity]
    D5 --> D6[Create Event with OTP]
    D6 --> D7[Display OTP to User]
    D7 --> D8[User Saves OTP]
    D8 --> D9[Event Published]
    
    E --> E1[Enter Event ID & Email]
    E1 --> E2[Enter OTP]
    E2 --> E3{OTP Valid?}
    E3 -->|No| E4[Show Error]
    E4 --> E2
    E3 -->|Yes| E5[Access Granted]
    E5 --> E6{Management Action}
    E6 -->|Edit Event| E7[Edit Event Details]
    E6 -->|Delete Event| E8[Confirm & Delete]
    E6 -->|Regenerate OTP| E9[Generate New OTP]
    
    E7 --> E10[Verify OTP Again]
    E8 --> E11[Verify OTP Again]
    E9 --> E12[Display New OTP]
    
    style A fill:#e1f5fe
    style D6 fill:#c8e6c9
    style E5 fill:#fff3e0
    style E8 fill:#ffebee
```

## 🎯 Detailed Process Flows

### 1. Event Creation Workflow

```mermaid
sequenceDiagram
    participant U as User
    participant UI as Create Event Page
    participant ES as Event Service
    participant OS as OTP Service
    participant LS as Local Storage
    
    U->>UI: Access Create Event Page
    UI->>U: Show Step 1: Email Input
    U->>UI: Enter Creator Email
    UI->>U: Show Step 2: Basic Information
    U->>UI: Enter Title, Description, Category
    UI->>U: Show Step 3: Date & Location
    U->>UI: Enter Event Details
    UI->>U: Show Step 4: Pricing & Capacity
    U->>UI: Configure Tickets & Capacity
    U->>UI: Click "Create Event"
    
    UI->>ES: Call createEvent()
    ES->>OS: Generate OTP for Event
    OS->>LS: Store OTP Data
    OS-->>ES: Return OTP Info
    ES->>LS: Store Event Data
    ES-->>UI: Return Success + OTP
    UI->>U: Display OTP Success Page
    U->>U: Save OTP Securely
```

### 2. Event Management Workflow

```mermaid
sequenceDiagram
    participant U as User
    participant UI as Management Page
    participant ES as Event Service
    participant OS as OTP Service
    
    U->>UI: Access Event Management
    UI->>U: Show Verification Form
    U->>UI: Enter Event ID & Email
    U->>UI: Enter 6-digit OTP
    
    UI->>ES: Call verifyEventOTP()
    ES->>OS: Verify OTP
    OS-->>ES: Return Verification Result
    
    alt OTP Valid
        ES->>ES: Load Event Details
        ES-->>UI: Return Event Data
        UI->>U: Show Management Dashboard
        
        U->>UI: Choose Action (Edit/Delete/Regenerate)
        
        alt Edit Event
            UI->>U: Show Edit Form
            U->>UI: Submit Changes
            UI->>ES: Call updateEvent() with OTP
            ES->>OS: Re-verify OTP
            ES->>ES: Update Event Data
            ES-->>UI: Return Success
            UI->>U: Show Success Message
        
        else Delete Event
            UI->>U: Show Confirmation Dialog
            U->>UI: Confirm Deletion
            UI->>ES: Call deleteEvent() with OTP
            ES->>OS: Re-verify OTP
            ES->>ES: Remove Event Data
            ES-->>UI: Return Success
            UI->>U: Show Deletion Success
        
        else Regenerate OTP
            UI->>ES: Call regenerateEventOTP()
            ES->>OS: Generate New OTP
            OS-->>ES: Return New OTP
            ES-->>UI: Return New OTP
            UI->>U: Display New OTP
        end
    
    else OTP Invalid
        ES-->>UI: Return Error
        UI->>U: Show Error Message
    end
```

### 3. OTP Lifecycle Workflow

```mermaid
stateDiagram-v2
    [*] --> Generated: Event Created
    Generated --> Active: OTP Created (30 min timer)
    Active --> Used: Successful Verification
    Active --> Expired: 30 Minutes Passed
    Active --> Regenerated: User Requests New OTP
    Used --> [*]: OTP Consumed
    Expired --> [*]: OTP Invalid
    Regenerated --> Active: New OTP Created
    
    note right of Generated
        OTP: 6-digit random number
        Expires: 30 minutes
        Storage: localStorage
    end note
    
    note right of Active
        Can be used for:
        - Event verification
        - Edit operations
        - Delete operations
    end note
```

## 🔐 Security Workflow

### OTP Security Process

```mermaid
graph LR
    A[Event Creation] --> B[Generate Random 6-digit OTP]
    B --> C[Store with Email & Event ID]
    C --> D[Set 30-minute Expiry]
    D --> E[Display to User Once]
    E --> F[User Must Save OTP]
    
    G[Management Request] --> H[Enter Event ID + Email + OTP]
    H --> I{Verify All 3 Match?}
    I -->|Yes| J{OTP Not Expired?}
    I -->|No| K[Access Denied]
    J -->|Yes| L{OTP Not Used?}
    J -->|No| M[Access Denied - Expired]
    L -->|Yes| N[Grant Access]
    L -->|No| O[Access Denied - Used]
    N --> P[Mark OTP as Used]
    
    style K fill:#ffebee
    style M fill:#ffebee
    style O fill:#ffebee
    style N fill:#c8e6c9
```

## 📱 User Interface Workflow

### Navigation Flow

```mermaid
graph TB
    A[Header Navigation] --> B[Home]
    A --> C[Events]
    A --> D[Create Event]
    A --> E[Manage Event]
    
    B --> B1[Hero Section]
    B1 --> B2[Featured Events]
    B2 --> B3[Event Categories]
    
    C --> C1[Event List with Filters]
    C1 --> C2[Event Detail Page]
    C2 --> C3[Registration Page]
    
    D --> D1[5-Step Creation Process]
    D1 --> D2[OTP Display Page]
    D2 --> D3[Success Confirmation]
    
    E --> E1[Verification Page]
    E1 --> E2[Management Dashboard]
    E2 --> E3[Edit/Delete Actions]
    
    style D2 fill:#fff3e0
    style E2 fill:#e8f5e8
```

## ⚙️ Technical Implementation Workflow

### Service Layer Architecture

```mermaid
graph TB
    subgraph "Frontend Components"
        A[HomePage]
        B[EventsPage]
        C[CreateEventPage]
        D[EventManagementPage]
        E[OTPInput Component]
    end
    
    subgraph "Service Layer"
        F[eventService]
        G[otpService]
    end
    
    subgraph "Data Storage"
        H[localStorage - Events]
        I[localStorage - OTPs]
        J[External API]
    end
    
    A --> F
    B --> F
    C --> F
    C --> G
    D --> F
    D --> G
    E --> G
    
    F --> H
    F --> J
    G --> I
    
    style F fill:#e3f2fd
    style G fill:#f3e5f5
    style H fill:#e8f5e8
    style I fill:#fff3e0
```

## 🚀 Deployment Workflow

```mermaid
graph LR
    A[Development] --> B[Build Process]
    B --> C[Static Files Generation]
    C --> D[Deployment to Server]
    D --> E[Production Environment]
    
    subgraph "Build Steps"
        B1[TypeScript Compilation]
        B2[Vite Build]
        B3[Asset Optimization]
        B4[Code Splitting]
    end
    
    B --> B1
    B1 --> B2
    B2 --> B3
    B3 --> B4
```

## 📊 Data Flow Workflow

### Event Data Management

```mermaid
graph TB
    A[User Input] --> B[Form Validation]
    B --> C[Event Service]
    C --> D[OTP Generation]
    C --> E[Event Storage]
    D --> F[OTP Storage]
    
    G[Management Request] --> H[OTP Verification]
    H --> I[Access Control]
    I --> J[Event Operations]
    J --> K[Data Update]
    
    style D fill:#fff3e0
    style H fill:#fff3e0
    style I fill:#e8f5e8
```

## 🎯 User Journey Summary

1. **Discovery**: User browses events or wants to create one
2. **Creation**: User follows 5-step process with email verification
3. **Security**: System generates unique OTP for event management
4. **Storage**: User securely saves OTP for future use
5. **Management**: User can edit/delete events using OTP verification
6. **Lifecycle**: OTP expires in 30 minutes, can be regenerated

## 🔧 Error Handling Workflow

```mermaid
graph TB
    A[User Action] --> B{Validation Check}
    B -->|Pass| C[Process Request]
    B -->|Fail| D[Show Validation Error]
    
    C --> E{Operation Success?}
    E -->|Yes| F[Show Success Message]
    E -->|No| G[Show Error Message]
    
    G --> H{Retry Available?}
    H -->|Yes| I[Offer Retry Option]
    H -->|No| J[Suggest Alternative]
    
    style D fill:#ffebee
    style G fill:#ffebee
    style F fill:#c8e6c9
```

This comprehensive workflow documentation provides a complete overview of how the OTP-based event management system operates, from user interactions to technical implementation details.