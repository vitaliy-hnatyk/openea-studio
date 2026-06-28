import { ArchitectureRepository } from '../types/architecture';

export const sampleRepository: ArchitectureRepository = {
  applications: [
    {
      id: 'web-portal', name: 'Web Portal', domain: 'Customer', description: 'Customer-facing self-service portal.', owner: 'Customer Team', status: 'active', criticality: 'medium', technologies: ['React', 'Node.js'], annualCost: 82000, lifecycle: '2020 - Present', position: { x: 280, y: 70 }
    },
    {
      id: 'mobile-app', name: 'Mobile App', domain: 'Customer', description: 'Native mobile channel for customers.', owner: 'Mobile Team', status: 'active', criticality: 'medium', technologies: ['Kotlin', 'Swift'], annualCost: 62000, lifecycle: '2021 - Present', position: { x: 620, y: 70 }
    },
    {
      id: 'api-gateway', name: 'API Gateway', domain: 'Shared Services', description: 'Central API gateway for routing and security.', owner: 'Platform Team', status: 'active', criticality: 'high', technologies: ['Kong', 'OAuth2'], annualCost: 95000, lifecycle: '2019 - Present', position: { x: 440, y: 185 }
    },
    {
      id: 'order-service', name: 'Order Service', domain: 'Sales', description: 'Handles order processing, validation and orchestration between systems.', owner: 'John Smith', status: 'active', criticality: 'high', technologies: ['Java', 'Spring Boot'], annualCost: 120000, lifecycle: '2019 - Present', position: { x: 420, y: 330 }
    },
    {
      id: 'crm', name: 'CRM System', domain: 'Sales', description: 'Customer master data and account management.', owner: 'Sales Ops', status: 'active', criticality: 'high', technologies: ['Salesforce'], annualCost: 150000, lifecycle: '2016 - Present', position: { x: 150, y: 330 }
    },
    {
      id: 'billing', name: 'Billing System', domain: 'Finance', description: 'Billing, invoices, balances and payment reconciliation.', owner: 'Finance IT', status: 'active', criticality: 'critical', technologies: ['Java EE', 'Oracle'], annualCost: 210000, lifecycle: '2014 - Present', position: { x: 760, y: 330 }
    },
    {
      id: 'inventory', name: 'Inventory Service', domain: 'Operations', description: 'Product stock and availability service.', owner: 'Operations IT', status: 'active', criticality: 'medium', technologies: ['.NET', 'PostgreSQL'], annualCost: 70000, lifecycle: '2022 - Present', position: { x: 425, y: 480 }
    },
    {
      id: 'email-service', name: 'Email Service', domain: 'Shared Services', description: 'Transactional emails and notifications.', owner: 'Platform Team', status: 'active', criticality: 'low', technologies: ['SMTP', 'RabbitMQ'], annualCost: 23000, lifecycle: '2018 - Present', position: { x: 150, y: 490 }
    },
    {
      id: 'oracle-db', name: 'Oracle Database', domain: 'Shared Services', description: 'Shared operational database for legacy systems.', owner: 'DBA Team', status: 'active', criticality: 'critical', technologies: ['Oracle 19c'], annualCost: 180000, lifecycle: '2012 - Present', position: { x: 780, y: 500 }
    }
  ],
  integrations: [
    { id: 'i1', sourceId: 'web-portal', targetId: 'api-gateway', type: 'REST', label: 'REST', criticality: 'medium' },
    { id: 'i2', sourceId: 'mobile-app', targetId: 'api-gateway', type: 'REST', label: 'REST', criticality: 'medium' },
    { id: 'i3', sourceId: 'api-gateway', targetId: 'order-service', type: 'REST', label: 'REST', criticality: 'high' },
    { id: 'i4', sourceId: 'crm', targetId: 'order-service', type: 'REST', label: 'REST', criticality: 'high' },
    { id: 'i5', sourceId: 'order-service', targetId: 'billing', type: 'SOAP', label: 'SOAP', criticality: 'critical' },
    { id: 'i6', sourceId: 'order-service', targetId: 'inventory', type: 'REST', label: 'REST', criticality: 'medium' },
    { id: 'i7', sourceId: 'order-service', targetId: 'email-service', type: 'File', label: 'File', criticality: 'low' },
    { id: 'i8', sourceId: 'billing', targetId: 'oracle-db', type: 'Database', label: 'Database', criticality: 'critical' },
    { id: 'i9', sourceId: 'order-service', targetId: 'oracle-db', type: 'Database', label: 'Database', criticality: 'high' }
  ],
  capabilities: [
    { id: 'cap-order', name: 'Order Management', domain: 'Sales', owner: 'Sales Ops', description: 'Manage order capture, validation and fulfillment orchestration.' },
    { id: 'cap-customer', name: 'Customer Management', domain: 'Customer', owner: 'Customer Team', description: 'Manage customers, accounts and self-service journeys.' },
    { id: 'cap-billing', name: 'Billing', domain: 'Finance', owner: 'Finance IT', description: 'Generate invoices, process payments and reconcile balances.' },
    { id: 'cap-inventory', name: 'Inventory Availability', domain: 'Operations', owner: 'Operations IT', description: 'Track stock, reservations and product availability.' }
  ],
  technologies: [
    { id: 'tech-react', name: 'React', category: 'Frontend', owner: 'Architecture Team', lifecycle: 'approved', description: 'Standard UI library for customer and internal web applications.' },
    { id: 'tech-java', name: 'Java', category: 'Backend', owner: 'Platform Team', lifecycle: 'approved', description: 'Primary backend language for business services.' },
    { id: 'tech-oracle', name: 'Oracle 19c', category: 'Database', owner: 'DBA Team', lifecycle: 'approved', description: 'Enterprise relational database platform.' },
    { id: 'tech-soap', name: 'SOAP', category: 'Integration', owner: 'Architecture Team', lifecycle: 'deprecated', description: 'Legacy integration style to be replaced by REST or events.' }
  ],
  roadmap: [
    { id: 'r1', title: 'Migrate Billing System to Cloud', due: 'May 2026', status: 'in-progress' },
    { id: 'r2', title: 'Upgrade Oracle Database', due: 'Jun 2026', status: 'planned' },
    { id: 'r3', title: 'Deprecate Legacy CRM', due: 'Jul 2026', status: 'in-progress' },
    { id: 'r4', title: 'Implement Event Streaming', due: 'Aug 2026', status: 'planned' }
  ]
};
