import React from "react";
import { Button, Divider, Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

const TermsOfService: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "#fff",
        padding: "40px",
        maxWidth: 900,
        margin: "0 auto",
      }}
    >
      {/* ❌ Close Button */}
      <Button
        type="text"
        icon={<CloseOutlined style={{ fontSize: 22, color: "#000" }} />}
        onClick={() => navigate("/")}
        style={{
          position: "absolute",
          top: 20,
          right: 4,
          zIndex: 1000,
        }}
      />

      <Title level={2} style={{ textAlign: "center", marginTop: 40 }}>
        Terms and Conditions
      </Title>
    

       <Paragraph>
        These terms and conditions (“Terms”) govern the use of services made available on or through{" "}
        <a href="https://www.swachify.com" target="_blank" rel="noopener noreferrer">
          https://www.swachify.com
        </a>{" "}
        and/or the Swachify Cleaning Service mobile app (collectively, the “Platform”, and together
        with the services made available on or through the Platform, the “Services”). These Terms
        also include our{" "}
        <a href="https://www.swachify.com/privacy-policy" target="_blank" rel="noopener noreferrer">
          Privacy Policy
        </a>
        , and any guidelines, additional, or supplemental terms, policies, and disclaimers made
        available or issued by us from time to time (“Supplemental Terms”). The Privacy Policy and
        the Supplemental Terms form an integral part of these Terms. In the event of a conflict
        between these Terms and the Supplemental Terms with respect to applicable Services, the
        Supplemental Terms will prevail.
      </Paragraph>

      <Paragraph>
        The Terms constitute a binding and enforceable legal contract between{" "}
        <strong>Swachify Cleaning Service Private Limited</strong> (a company incorporated under the
        Companies Act, 2013, with its registered address at Hyderabad, Telangana, India) (“Swachify”,
        “we”, “us”, or “our”), and you, a user of the Services, or any legal entity that books
        cleaning or related services on behalf of end-users (“you” or “Customer”). By using the
        Services, you represent and warrant that you have full legal capacity and authority to agree
        to and bind yourself to these Terms. If you represent any other person, you confirm and
        represent that you have the necessary power and authority to bind such person to these Terms.
      </Paragraph>

      <Paragraph>
        By using the Services, you agree that you have read, understood, and are bound by these
        Terms, as amended from time to time, and that you will comply with the requirements listed
        here. These Terms expressly supersede any prior written agreements with you. If you do not
        agree to these Terms or comply with the requirements listed here, please do not use the
        Services.
      </Paragraph>

      <Divider />

       <Title level={3}>1. SERVICES</Title>

      <Paragraph>
        (a) The Services include the provision of the Platform that enables you to arrange and
        schedule different home-based cleaning and maintenance services with independent
        third-party service providers of those services (“Service Professionals”). As a part of the
        Services, Swachify facilitates the transfer of payments to Service Professionals for the
        services they render to you and collects payments on behalf of such Service Professionals.
      </Paragraph>

      <Paragraph>
        (b) The services rendered by Service Professionals are referred to as “Pro Services.” The
        term “Services” does not include the Pro Services. Swachify does not provide the Pro
        Services and is not responsible for their provision. Service Professionals are solely liable
        and responsible for the Pro Services that they offer or otherwise provide through the
        Platform. Swachify and its affiliates do not employ Service Professionals, nor are Service
        Professionals agents, contractors, or partners of Swachify or its affiliates. Service
        Professionals do not have the ability to bind or represent Swachify.
      </Paragraph>

      <Paragraph>
        (c) The Platform is for your personal and non-commercial use only, unless otherwise agreed
        upon in accordance with the terms of a separate agreement. Please note that the Platform is
        intended for use only within India. You agree that in the event you avail the Services or
        Pro Services from a legal jurisdiction other than the territory of India, you will be deemed
        to have accepted the Swachify terms and conditions applicable to that jurisdiction.
      </Paragraph>

      <Paragraph>
        (d) The Services are made available under various brands owned by or otherwise licensed to
        Swachify and its affiliates.
      </Paragraph>

      <Paragraph>
        (e) A key part of the Services is Swachify’s ability to send you text messages, electronic
        mails, or WhatsApp messages, including in connection with your bookings, your utilisation of
        the Services, or as a part of its promotional and marketing strategies. While you may opt
        out of receiving these text messages by contacting Swachify at{" "}
        <a href="mailto:info@swachify.com">info@swachify.com</a> or through the in-Platform
        settings, you agree and acknowledge that this may impact Swachify’s ability to provide the
        Services (or a part of the Services) to you.
      </Paragraph>

      <Paragraph>
        (f) In certain instances, you may be required to furnish identification proof to avail the
        Services or the Pro Services and hereby agree to do so. A failure to comply with this
        request may result in your inability to use the Services or Pro Services.
      </Paragraph>

      <Paragraph>
        (g) <strong>Swachify Credits:</strong>
      </Paragraph>

      <Paragraph>
        (i) Swachify may, in its sole discretion, offer promotional codes that may be redeemed for
        credits, other features, or benefits related to the Services and/or Pro Services, subject to
        any additional terms that may apply to a promotional code (“Swachify Credits”).
      </Paragraph>

      <Paragraph>
        (ii) You agree that (i) you shall use Swachify Credits in a lawful manner and only for the
        purposes specified by such Swachify Credits, (ii) you shall not duplicate, sell, or transfer
        the Swachify Credits in any manner (including by posting such codes on a public forum)
        unless you have Swachify’s express prior consent to do so, (iii) Swachify Credits may be
        disabled by Swachify at any time for any reason without any liability to you, (iv) Swachify
        Credits are not valid for cash, and (v) Swachify Credits may expire prior to your use.
      </Paragraph>

      <Paragraph>
        (iii) Swachify may, at its sole discretion, provide only certain users with Swachify Credits
        that may result in different amounts charged for the same or similar services obtained by
        other users.
      </Paragraph>

      <Paragraph>
        (iv) Swachify reserves the right to withhold or deduct credits or other features or benefits
        obtained through the use of Swachify Credits, by you or any other user, if Swachify
        reasonably determines or believes that the use or redemption of the Swachify Credits was in
        error, fraudulent, illegal, or in violation of the applicable Swachify Credit terms or these
        Terms.
      </Paragraph>

        <Divider />

         <Title level={3}>2. ACCOUNT CREATION</Title>

      <Paragraph>
        (a) To avail the Services, you will be required to create an account on the Platform
        (“Account”). For this Account, you may be required to furnish certain details, including but
        not limited to your phone number. To create an Account, you must be at least 18 years of
        age.
      </Paragraph>

      <Paragraph>
        (b) You warrant that all information furnished in connection with your Account is and shall
        remain accurate and true. You agree to promptly update your details on the Platform in the
        event of any change to or modification of this information.
      </Paragraph>

      <Paragraph>
        (c) You are solely responsible for maintaining the security and confidentiality of your
        Account and agree to immediately notify Swachify Cleaning Service (“Swachify”) of any
        disclosure or unauthorised use of your Account or any other breach of security with respect
        to your Account by contacting us at{" "}
        <a href="mailto:info@swachify.com">info@swachify.com</a>.
      </Paragraph>

      <Paragraph>
        (d) You are liable and accountable for all activities that take place through your Account,
        including activities performed by persons other than you. Swachify shall not be liable for
        any unauthorised access to your Account.
      </Paragraph>

      <Paragraph>
        (e) You agree to receive communications from Swachify regarding (i) requests for payments,
        (ii) information about Swachify and the Services, (iii) promotional offers and services from
        Swachify and its third-party partners, and (iv) any other matter in relation to the
        Services.
      </Paragraph>
      <Divider />
      <Title level={3}>3. USER CONTENT</Title>

      <Paragraph>
        (a) Our Platform may contain interactive features or services that allow users who have
        created an account with us to post, upload, publish, display, transmit, or submit comments,
        reviews, suggestions, feedback, ideas, or other content on or through the Platform (“User
        Content”).
      </Paragraph>

      <Paragraph>
        (b) As part of the effective provision of the Services and for quality control purposes,
        Swachify Cleaning Service (“Swachify”) may request reviews from you about Service
        Professionals, and you agree and acknowledge that Service Professionals may provide reviews
        about you to Swachify. You must not knowingly provide false, inaccurate, or misleading
        information in respect of the reviews. Reviews will be used by Swachify for quality control
        purposes and to determine whether Customers and Service Professionals are appropriate users
        of the Platform. If Swachify determines, at its sole discretion, that you are not an
        appropriate user, it reserves the right to cancel your registration and remove you from the
        Platform.
      </Paragraph>

      <Paragraph>
        (c) You grant Swachify a non-exclusive, worldwide, perpetual, irrevocable, transferable,
        sublicensable, and royalty-free licence to (i) use, publish, display, store, host, transfer,
        process, communicate, distribute, make available, modify, adapt, translate, and create
        derivative works of the User Content for the functioning of, and in connection with, the
        Services; and (ii) use the User Content for the limited purposes of advertising and
        promoting the Services, or furnishing evidence before a court or authority of competent
        jurisdiction under applicable laws.
      </Paragraph>

      <Paragraph>
        (d) In connection with these Terms and the licences granted under this clause, you hereby
        waive any claims arising out of any moral rights or other similar rights relating to the
        User Content.
      </Paragraph>

      <Paragraph>
        (e) You agree and acknowledge that Swachify may, without notice to you, remove or otherwise
        restrict access to User Content that, in its sole discretion, violates these Terms or any
        applicable law.
      </Paragraph>
      <Divider />
       <Title level={3}>4. CONSENT TO USE DATA</Title>

      <Paragraph>
        (a) You agree that we may, in accordance with our Privacy Policy, collect and use your
        personal data. The Privacy Policy is available at{" "}
        <a
          href="https://www.swachify.com/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.swachify.com/privacy-policy
        </a>{" "}
        and it explains the categories of personal data that we collect or otherwise process about
        you and the manner in which we process such data.
      </Paragraph>

      <Paragraph>
        (b) In addition to any consent you may provide pursuant to the Privacy Policy, you hereby
        consent to us sharing your information with our affiliates or other third-party service
        providers. We may use information and data pertaining to your use of the Services for the
        provision of the Services, analytics, trend identification, and statistical purposes to
        further enhance the effectiveness and efficiency of our Services. This may include the
        provision of beneficial schemes, new offers, and overall experience enhancement.
      </Paragraph>

      <Paragraph>
        (c) Subject to applicable laws, we may be directed by law enforcement agencies or government
        authorities to disclose data related to you in connection with criminal or civil
        proceedings. You understand and agree that, in such instances, we shall have the right to
        share such data with the relevant agencies or authorities.
      </Paragraph>
      <Divider />
       <Title level={3}>5. BOOKINGS</Title>

      <Paragraph>
        (a) <strong>Orders:</strong> The Platform allows you to request various home cleaning and
        related services (“Pro Services”) at a time of your choosing, based on available slots. To
        make a booking, please follow the instructions on the Platform and provide the necessary
        information. Swachify will make reasonable efforts to connect you with a Service
        Professional who can deliver the requested service at your preferred time. If we are unable
        to find a Service Professional for the selected slot, we will contact you to suggest an
        alternative time.
      </Paragraph>

      <Paragraph>
        (b) <strong>Confirmation:</strong> Once your booking request is submitted, we will send a
        confirmation via SMS, email, or push notification. After confirmation, payment must be made
        in accordance with these Terms or as indicated on the Platform. When a Service Professional
        is assigned to your booking, you will receive confirmation details through the Platform, SMS,
        email, or push notification.
      </Paragraph>

      <Paragraph>
        (c) <strong>Cancellations:</strong> Bookings cancelled before confirmation on the Platform
        will not incur any charges. Once confirmed, cancellations will be subject to Swachify’s
        <strong> cancellation policy</strong>, which outlines applicable cancellation fees and
        timelines.
      </Paragraph>

      <Paragraph>
        (d) <strong>Substitution:</strong> In case the assigned Service Professional becomes
        unavailable or cancels, Swachify will provide a suitable substitute from our pool of
        verified and registered Service Professionals.
      </Paragraph>
      <Divider />
      <Title level={3}>6. PRICING, FEES, AND PAYMENT TERMS</Title>

      <Paragraph>
        (a) <strong>Service Charges:</strong> Swachify reserves the right to charge you for the
        various Services that you may avail and/or for any other facilities or features you may opt
        for on or through the Platform, from time to time.
      </Paragraph>

      <Paragraph>
        (b) <strong>Charges and Fees for Pro Services:</strong>
      </Paragraph>

      <Paragraph>
        (i) For the Pro Services you book through the Platform, you agree to pay the Service
        Professional the amount displayed at the time of booking along with any additional charges
        for: (a) extra Pro Services you avail, (b) out-of-pocket expenses incurred by the Service
        Professional, and (c) costs related to materials or supplies used for the service
        (“<strong>Charges</strong>”). In addition to these Charges, Swachify may charge a
        convenience fee for facilitating the booking and payment transfer (“<strong>Fees</strong>”).
        The final bill may include additional components such as a safety fee, warranty fee,
        insurance fee, or Service Professional welfare fee.
      </Paragraph>

      <Paragraph>
        (ii) Swachify will notify you of the applicable Charges, Fees, and available payment methods
        at the time of booking. Payments can typically be made via credit card, debit card, UPI,
        wallets, net banking, or cash upon completion. Swachify reserves the right to modify or
        restrict available payment modes. Note that certain payment methods like cash may not always
        be available. If you select “cash upon completion,” you agree to pay both the Charges and
        Fees directly to the Service Professional.
      </Paragraph>

      <Paragraph>
        (iii) Depending on the service type, Charges and Fees may be payable either at the time of
        booking or upon completion of the Pro Service, as specified by Swachify.
      </Paragraph>

      <Paragraph>
        (iv) For clarity, the Charges are payable to Service Professionals. Swachify acts only as a
        limited collection agent on their behalf to facilitate collection and transfer of payments.
      </Paragraph>

      <Paragraph>
        (v) <strong>Taxes:</strong> All Charges and Fees include applicable taxes.
      </Paragraph>

      <Paragraph>
        (vi) Swachify reserves the right to reasonably revise Charges and Fees at its discretion.
        Changes will not affect bookings confirmed before the revised prices are published on the
        Platform.
      </Paragraph>

      <Paragraph>
        (vii) Payments made are final and non-refundable, unless determined otherwise by Swachify or
        as required by applicable laws. You may, under certain laws, be entitled to a refund or
        other remedies if there is a failure in the provision of Services.
      </Paragraph>

      <Paragraph>
        (viii) You acknowledge that Charges and Fees may vary based on demand, time, and location.
        Swachify will use reasonable efforts to inform you of such variations, but by using the
        Services, you accept responsibility for all applicable charges incurred under your account.
      </Paragraph>

      <Paragraph>
        (c) <strong>Payment Processors:</strong> Swachify may engage third-party payment processors
        (“Payment Processors”) to handle payments. The processing of payments will be governed by
        the terms and policies of such Payment Processors, in addition to these Terms. Swachify is
        not responsible for any errors caused by the Payment Processor. Any unsuccessful transaction
        will be reversed as per the Payment Processor’s policies.
      </Paragraph>

      <Paragraph>
        (d) <strong>Cancellation:</strong> You may cancel a booking before the Service Professional
        arrives. In such cases, a cancellation fee may apply in accordance with Swachify’s
        <strong> cancellation policy</strong>. Swachify reserves the right to deduct applicable
        taxes from such fees.
      </Paragraph>

      <Paragraph>
        (e) <strong>Subscriptions:</strong> Swachify may offer subscription plans that provide
        additional benefits, including discounts or priority access to services. These packages will
        be governed by additional terms and conditions, which form an integral part of these Terms.
      </Paragraph>

      <Paragraph>
        (f) <strong>Gratuities:</strong> Swachify does not designate any part of your payment as a
        tip or gratuity to the Service Professional. While you are free to provide a voluntary
        gratuity, it is not mandatory, and Swachify does not distribute any portion of your payment
        as a tip.
      </Paragraph>
      <Divider />
      <Title level={3}>7. CUSTOMER CONDUCT</Title>

      <Paragraph>
        (a) <strong>Non-Discrimination:</strong> Swachify strictly prohibits any form of
        discrimination against Service Professionals. Discrimination includes, but is not limited
        to, any refusal or reluctance to accept Pro Services based on characteristics such as race,
        religion, caste, national origin, disability, sexual orientation, sex, marital status,
        gender identity, age, or any other attribute protected under applicable law.
      </Paragraph>

      <Paragraph>
        (b) <strong>Respectful Behavior:</strong> Customers are expected to treat all Service
        Professionals with respect, courtesy, and fairness. You must also ensure a safe, clean, and
        appropriate environment for the Service Professional to perform their tasks. Service
        Professionals reserve the right to refuse or discontinue Pro Services if the environment is
        unsafe, unsanitary, or if they experience any disrespectful, abusive, or inappropriate
        behavior. Swachify retains the right to suspend, restrict, or permanently block your access
        to the Platform or Services if you behave in a discourteous, abusive, or unlawful manner
        towards any Service Professional.
      </Paragraph>

      <Paragraph>
        (c) <strong>Customer Responsibility:</strong> You agree to be fully responsible and liable
        for any discriminatory behavior or failure—intentional or otherwise—to provide Service
        Professionals with a safe, clean, and suitable location to perform the Pro Services. You
        must also disclose any relevant information that may affect the Service Professional’s
        ability to perform their duties safely or may impact their health, safety, or well-being to
        both Swachify and the concerned Service Professional prior to the commencement of the
        service.
      </Paragraph>

      <Paragraph>
        (d) <strong>Reporting Misconduct:</strong> If a Service Professional behaves in a manner
        that is discourteous, disrespectful, abusive, inappropriate, or unlawful, you are required
        to report such incidents to{" "}
        <a href="mailto:grievance@swachify.com">grievance@swachify.com</a> as soon as possible, but
        no later than <strong>48 (forty-eight) hours</strong> from the occurrence of the incident.
        Swachify will investigate all such reports in accordance with applicable law and take
        appropriate action.
      </Paragraph>
      <Divider />
      <Title level={3}>8. THIRD PARTY SERVICES</Title>

      <Paragraph>
        (a) The Swachify Platform may include services, content, documents, and information owned by,
        licensed to, or otherwise made available by third parties (“Third Party Services”) and may
        also contain links directing you to such Third Party Services. You acknowledge and agree
        that all Third Party Services are the sole responsibility of the respective third party that
        provides or operates them. Your access to or use of any Third Party Services is entirely at
        your own discretion and risk.
      </Paragraph>

      <Paragraph>
        (b) Swachify makes no representations or warranties and expressly disclaims all liability
        arising out of or related to any Third Party Services, including their reliability,
        accuracy, legality, or completeness. If you choose to avail any Third Party Services, you
        understand and agree that such usage will be governed exclusively by the terms of use,
        privacy policy, and other applicable policies of the respective third party. All
        intellectual property rights in and to Third Party Services belong solely to the respective
        third parties.
      </Paragraph>
      <Divider />
       <Title level={3}>9. YOUR RESPONSIBILITIES</Title>

      <Paragraph>
        (a) You represent and warrant that all information you provide in relation to the Services
        and Pro Services is complete, true, and correct as of the date of agreeing to these Terms
        and shall continue to remain accurate while you avail the Services and/or Pro Services. If
        any information changes, you must promptly notify Swachify Cleaning Service. We are not
        liable for any loss or damage arising from inaccurate, incomplete, or misleading information
        provided by you or from your failure to disclose any material fact.
      </Paragraph>

      <Paragraph>
        (b) You agree to cooperate fully with Swachify Cleaning Service in the defence of any legal
        proceedings that may arise from your breach of obligations or covenants under these Terms.
      </Paragraph>

      <Paragraph>
        (c) In respect of User Content, you represent and warrant that:
        <ul>
          <li>(i) you own or have obtained all necessary rights to provide such User Content;</li>
          <li>
            (ii) you are solely responsible for all activities on your account and any User
            Content you submit;
          </li>
          <li>
            (iii) the User Content does not violate any agreements, rights, or laws applicable to
            you;
          </li>
          <li>
            (iv) the User Content does not infringe upon any intellectual property, privacy, or
            publicity rights of any individual or entity;
          </li>
          <li>
            (v) the User Content does not contain viruses, corrupted data, or other harmful or
            disruptive code;
          </li>
          <li>(vi) the User Content does not violate any third-party rights; and</li>
          <li>
            (vii) the User Content:
            <ul>
              <li>
                (A) does not belong to another person without authorization or rights to share it;
              </li>
              <li>
                (B) does not threaten national integrity, security, or public order, or incite
                unlawful acts;
              </li>
              <li>
                (C) is not defamatory, obscene, hateful, invasive of privacy, or otherwise
                unlawful; and
              </li>
              <li>
                (D) is not offensive, discriminatory, or harmful to any individual or group.
              </li>
            </ul>
          </li>
        </ul>
      </Paragraph>

      <Paragraph>
        (d) You agree not to use the Services in any manner except as expressly permitted under
        these Terms. Specifically, you shall not:
        <ul>
          <li>
            (i) infringe upon any proprietary rights, including copyrights, patents, or trademarks;
          </li>
          <li>
            (ii) copy, modify, distribute, or license the Services without authorization;
          </li>
          <li>
            (iii) use the Services to transmit malware, spyware, or any harmful code;
          </li>
          <li>(iv) use any bots, spiders, or automated systems to copy content or data;</li>
          <li>
            (v) systematically extract or compile information from the Services for any database;
          </li>
          <li>(vi) use the Services unlawfully, fraudulently, or maliciously;</li>
          <li>(vii) decompile, reverse-engineer, or disassemble the Services;</li>
          <li>(viii) frame or mirror any portion of the Services; or</li>
          <li>(ix) violate any applicable laws or regulations.</li>
        </ul>
      </Paragraph>

      <Paragraph>
        (e) You shall not engage in any activity that disrupts or interferes with the functioning of
        the Services.
      </Paragraph>

      <Paragraph>
        (f) You shall not attempt to gain unauthorised access to any part of the Services, servers,
        or connected systems through hacking, password mining, or any other illegitimate means.
      </Paragraph>

      <Paragraph>
        (g) You agree not to directly or indirectly solicit, influence, or engage with any Service
        Professional from whom you have availed Pro Services outside of the Swachify platform. You
        further agree that this restriction is reasonable and necessary to protect the privacy,
        safety, and integrity of Service Professionals and the Swachify Cleaning Service platform.
      </Paragraph>
      <Divider />
       <Title level={3}>10. OUR INTELLECTUAL PROPERTY</Title>

      <Paragraph>
        (a) All rights, title, and interest in and to the Services, including all intellectual
        property rights arising out of or relating to the Services, are owned by or licensed to
        Swachify Cleaning Service. Subject to your compliance with these Terms, we grant you a
        non-exclusive, non-transferable, non-sublicensable, revocable, and limited licence to use
        the Services solely in accordance with these Terms and our written instructions issued from
        time to time. Any rights not expressly granted herein are reserved by Swachify Cleaning
        Service or its licensors.
      </Paragraph>

      <Paragraph>
        (b) We may, from time to time, request that you provide suggestions, ideas, or feedback,
        including bug reports, relating to the Services (“Feedback”). You agree that Swachify
        Cleaning Service may freely use, copy, disclose, publish, display, distribute, and exploit
        any Feedback you provide without any obligation of royalty, acknowledgement, prior consent,
        or restriction based on your intellectual property rights.
      </Paragraph>

      <Paragraph>
        (c) Except as expressly stated in these Terms, nothing in these Terms shall be construed as
        conferring any right, title, or licence in or to any of our or any third party’s
        intellectual property rights.
      </Paragraph>
      <Divider />
      <Title level={3}>11. TERM AND TERMINATION</Title>

      <Paragraph>
        (a) These Terms shall remain in effect unless terminated in accordance with the provisions
        contained herein.
      </Paragraph>

      <Paragraph>
        (b) Swachify Cleaning Service may restrict, deactivate, or terminate your access to or use of
        the Services, or any part thereof:
      </Paragraph>

      <Paragraph>
        (i) immediately and at any time at our sole discretion, if:
      </Paragraph>
      <ul style={{ paddingLeft: 24 }}>
        <li>
          (A) you violate or breach any of the obligations, responsibilities, or covenants under
          these Terms;
        </li>
        <li>(B) you cease to be a user of our Services;</li>
        <li>
          (C) you do not, or are likely not to, qualify under applicable law or under the standards
          and policies of Swachify Cleaning Service or its affiliates to access and use the Services;
        </li>
        <li>(D) you violate or breach our Community Guidelines;</li>
      </ul>

      <Paragraph>
        (ii) upon thirty (30) days’ prior written notice to you; or
      </Paragraph>
      <Paragraph>
        (iii) immediately, for any legitimate business, legal, or regulatory reason.
      </Paragraph>

      <Paragraph>
        (c) You may terminate these Terms at any time, for any reason, by sending a written notice to
        Swachify Cleaning Service at{" "}
        <a href="mailto:privacy@swachify.com">privacy@swachify.com</a>.
      </Paragraph>

      <Paragraph>(d) Upon termination of these Terms:</Paragraph>
      <ul style={{ paddingLeft: 24 }}>
        <li>(i) your Account will expire;</li>
        <li>(ii) your access to the Services will be disabled; and</li>
        <li>
          (iii) these Terms shall terminate, except for those provisions that are expressly, or by
          implication, intended to survive termination or expiry.
        </li>
      </ul>
      <Divider />
      <Title level={3}>12. DISCLAIMERS AND WARRANTIES</Title>

      <Paragraph>
        (a) The Services are provided on an “as is” basis without warranty of any kind—express,
        implied, statutory, or otherwise—including, without limitation, implied warranties of title,
        non-infringement, merchantability, or fitness for a particular purpose. Without limiting the
        foregoing, Swachify Cleaning Service makes no warranty that the Services will meet your
        requirements or expectations.
      </Paragraph>

      <Paragraph>
        (b) No advice or information, whether oral or written, obtained by you from Swachify Cleaning
        Service shall create any warranty not expressly stated in these Terms.
      </Paragraph>

      <Paragraph>
        (c) While Swachify strives to provide accurate information about services and charges, pricing
        errors may occur from time to time.
      </Paragraph>

      <Paragraph>
        (d) You acknowledge that Swachify Cleaning Service acts solely as a platform connecting you with
        service professionals. Swachify shall not be liable for any obligations not expressly stated
        in these Terms. Swachify is not responsible for fulfilment of any bookings, for the
        performance of services by any Service Professional, or for any acts or omissions by them,
        including damage to property. By booking through Swachify, you are entering into a direct
        contract with the Service Professional, and Swachify makes no warranties or guarantees
        regarding their performance.
      </Paragraph>

      <Paragraph>
        (e) You agree that soliciting or receiving services independently from any Service Professional
        (outside the Swachify Platform) is solely at your own risk, and you waive any rights you may
        have under these Terms.
      </Paragraph>

      <Paragraph>
        (f) Swachify makes no guarantees or representations regarding the reliability, quality, or
        suitability of any Service Professional.
      </Paragraph>

      <Paragraph>
        (g) You accept full responsibility for any consequences arising from your use of the Services
        or Pro Services and agree that Swachify shall not be liable in any manner whatsoever.
      </Paragraph>

      <Paragraph>
        (h) Swachify will maintain a complaints management framework and manage it reasonably in
        accordance with applicable laws on behalf of Service Professionals.
      </Paragraph>

      <Paragraph>
        (i) To the fullest extent permissible by law, Swachify, its affiliates, and related parties
        disclaim all liability for any loss or damage arising out of, or due to:
      </Paragraph>

      <ul style={{ paddingLeft: 24 }}>
        <li>
          (i) your use of, inability to use, or availability or unavailability of the Services or the
          Pro Services;
        </li>
        <li>
          (ii) any defect, interruption, or delay in operation or transmission of information,
          communication failure, theft, destruction, or unauthorised access to records, servers, or
          infrastructure;
        </li>
        <li>(iii) the Services being unavailable for any period of time; or</li>
        <li>(iv) loss of any User Content or data associated with your use of the Services.</li>
      </ul>

      <Paragraph>
        (j) In no event shall Swachify Cleaning Service, its officers, directors, employees,
        contractors, agents, partners, or suppliers be liable to you for any direct, indirect,
        incidental, consequential, punitive, exemplary, or special damages (including loss of business
        opportunities, revenue, profits, or data), even if Swachify had been advised of the
        possibility of such damages, arising from:
      </Paragraph>

      <ul style={{ paddingLeft: 24 }}>
        <li>(A) these Terms,</li>
        <li>(B) the Services or Pro Services,</li>
        <li>(C) your use or inability to use the Services or Pro Services, or</li>
        <li>(D) any other interactions with another user or Service Professional.</li>
      </ul>

      <Paragraph>
        (k) To the maximum extent permitted by law, Swachify’s total liability shall be limited to the
        amount of commission received by Swachify in respect of the specific booking in question and
        shall not exceed INR 10,000 (Rupees Ten Thousand) in total.
      </Paragraph>

      <Paragraph>
        (l) Nothing in these Terms will exclude or limit any warranty implied by law that it would be
        unlawful to exclude or limit.
      </Paragraph>
      <Divider />
      <Title level={3}>13. INDEMNITY</Title>

      <Paragraph>
        You agree to indemnify, defend (at the option of Swachify Cleaning Service), and hold harmless
        Swachify Cleaning Service, its parent companies, subsidiaries, affiliates, and its officers,
        employees, directors, agents, and representatives from and against any and all claims,
        demands, lawsuits, judicial proceedings, losses, liabilities, damages, and costs (including,
        without limitation, damages, settlements, and reasonable attorneys’ fees) arising out of or
        related to:
      </Paragraph>

      <ul style={{ paddingLeft: 24 }}>
        <li>your access to or use of the Services or Pro Services;</li>
        <li>your violation of these Terms; or</li>
        <li>any violation of these Terms by any third party who may use your Account.</li>
      </ul>

      <Paragraph>
        This indemnification obligation will survive the termination or expiration of these Terms and
        your use of the Services or Pro Services.
      </Paragraph>
      <Divider />
       <Title level={3}>14. JURISDICTION, GOVERNING LAWS, AND DISPUTE RESOLUTION</Title>

      <Paragraph>
        (a) These Terms shall be governed by, and construed and enforced in accordance with, the laws
        of India. Subject to the other provisions in this clause, the courts in New Delhi shall have
        exclusive jurisdiction over all issues arising out of or in connection with these Terms or the
        use of the Services.
      </Paragraph>

      <Paragraph>
        (b) Any controversies, conflicts, disputes, or differences arising out of or relating to these
        Terms shall be resolved by arbitration in New Delhi in accordance with the provisions of the
        Arbitration and Conciliation Act, 1996, as amended from time to time, which are deemed to be
        incorporated by reference in this clause.
      </Paragraph>

      <Paragraph>
        The arbitral tribunal shall consist of one (1) arbitrator appointed by Swachify Cleaning
        Service. The language of the arbitration shall be English. All parties to the arbitration shall
        maintain strict confidentiality of the proceedings and shall not disclose any information to
        any third party, except on a need-to-know basis or as required by law.
      </Paragraph>

      <Paragraph>
        The decision of the arbitrator shall be final and binding on all parties involved. Each party
        shall bear its own costs in connection with the arbitration proceedings.
      </Paragraph>
      <Divider />
       <Title level={3}>15. GRIEVANCE REDRESSAL</Title>

      <Paragraph>
        (a) You may contact our designated <strong>Grievance Redressal Officer/Nodal Officer</strong> 
        with any complaints or queries relating to the Services or these Terms through registered post 
        or by email, using the details provided below:
      </Paragraph>

      <Paragraph>
        <a href="mailto:grievanceofficer@swachify.com">grievanceofficer@swachify.com</a>
      </Paragraph>

      <Paragraph>
        (b) We shall ensure that your complaint is addressed and resolved within the timelines 
        prescribed under applicable laws.
      </Paragraph>
      <Divider />
      <Title level={3}>16. MISCELLANEOUS PROVISIONS</Title>

      <Paragraph>
        (a) <strong>Changes to Terms:</strong> These Terms are subject to revision at any time, as determined by us, 
        and all such changes shall be effective immediately upon being posted on the Platform. It is your 
        responsibility to review these Terms periodically for any updates or modifications. Your continued 
        use of the Platform after any changes have been posted shall be deemed as your acceptance of such 
        revised Terms.
      </Paragraph>

      <Paragraph>
        (b) <strong>Modification to the Services:</strong> We reserve the right, at any time, to add, modify, or 
        discontinue, temporarily or permanently, the Services (or any part thereof), with or without cause. 
        We shall not be liable for any such addition, modification, suspension, or discontinuation of the Services.
      </Paragraph>

      <Paragraph>
        (c) <strong>Severability:</strong> If any provision of these Terms is determined by any court or competent 
        authority to be unlawful or unenforceable, the remaining provisions shall continue in full force and effect. 
        If any unlawful or unenforceable portion of a provision can be deleted to make it lawful or enforceable, 
        such deletion shall be deemed to have been made.
      </Paragraph>

      <Paragraph>
        (d) <strong>Assignment:</strong> You shall not license, sell, transfer, or assign your rights, obligations, 
        or covenants under these Terms, or your Account, without our prior written consent. We may assign our rights 
        to any of our affiliates, subsidiaries, parent companies, successors, or third parties without any prior notice to you.
      </Paragraph>

      <Paragraph>
        (e) <strong>Notices:</strong> All notices, requests, demands, and determinations for us under these Terms 
        (other than routine operational communications) shall be sent to{" "}
        <a href="mailto:legal@swachify.com">legal@swachify.com</a>.
      </Paragraph>

      <Paragraph>
        (f) <strong>Third Party Rights:</strong> No third party shall have any rights to enforce any terms contained herein.
      </Paragraph>

      <Paragraph>
        (g) <strong>Force Majeure:</strong> We shall not be liable for any delay or failure to perform our obligations 
        if such delay or failure results from acts, events, omissions, or accidents beyond our reasonable control, 
        including but not limited to strikes, utility or network failures, acts of God, war, riot, civil commotion, 
        malicious damage, or compliance with any law or governmental order.
      </Paragraph>



      

     

    </div>
  );
};

export default TermsOfService;
