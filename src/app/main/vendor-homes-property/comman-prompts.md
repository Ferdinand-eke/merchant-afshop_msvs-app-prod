In the page file: src/app/main/vendor-homes-property/managedproperties/manageprofile/ProfileApp.jsx, displays views of merchants real-estate listings. Comprises of 3-tabs currently which are, the TimelineTab, AboutTab and PhotosVideosTab. I want a redesign of ths entire page in the most professional way: where these tabs are renamed to InspectionScehdules, Offers and Acqusitions. These tabs should be persisted in that even when refreshed, the current tab still shows

On the first tab InspectionSchedules:
    This component should have two sections top and down, the top should hold a very intuitive design that shows stats of the inspections story and below it, a section that holds a calender, that shows days of the month and inspections that fall on that day, Merchant should be able to look backward in time and forward in time to view these schedules. The section below carrying the calender should  have a 70% width for calender and a 30% width for an activity notifications that scrolls when overflowing withe the entire component at screen height and all mobile responsive. And on click on a day on the calender, a slider page from the right should show details of people coming for insoections on that day and their time slots. this modal should be persisted in that even at page reload, the slider remains. The API requests for the neded routes are: ${baseUrl}/inspection-schedules/merchant/schedules as a @Get request and the response is: return {
        success: true,
        message: 'Inspection schedules retrieved successfully',
        payload: schedules,
      }; Take a peak from the calender on: src/app/main/vendors-shop/dasboard/tabs/home/hotels-boards/hotels-widgets/ReservationsCalendar.jsx

On The second tab: Offers:
    This tab should be redeigned in a highly professional way for merchants to see offers on this properties, on click of any of these offers should pop up a slider from the right, taking about 50% of the page on larger screens and 70% of the screen on mobile screens with details of this offer displayed, and actions or merchant to either counter-offer, reject or accept offers. The routes that provides these merchant offers are: ${baseUrl}/realestate-offers/@UseGuards(MerchantAuthGuard)
    @Get('merchant/offers')
    async viewOffersOnMerchantListedEstates(
        @Request() req: any,
        @Query('propertyId') propertyId?: string,
        @Query() queryDto?: QueryPropertyOffersDto,
    ) {
        Logger.log('View Offers on Merchant Listed Estates route hit');
        return this.realestateOffersService.viewOffersOnMerchantListedEstates(
        req,
        propertyId,
        queryDto,
        );
    }  while the response is: return {
        success: true,
        message: 'Property offers retrieved successfully',
        payload: {
          offers,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page * limit < total,
            hasPrevPage: page > 1,
          },
        },
      }; . Other routes are defined as the following: /***2) View Single Offer */
            @UseGuards(MerchantAuthGuard)
            @Get('merchant/offer/:offerId')
            async viewSingleOffer(
                @Param('offerId') offerId: string,
                @Request() req: any,
            ) {
                Logger.log('View Single Offer route hit');
                return this.realestateOffersService.viewSingleOffer(req, offerId);
            }

            /***3) Decline Offer */
            @UseGuards(MerchantAuthGuard)
            @Put('merchant/decline/:offerId')
            async declineOffer(
                @Param('offerId') offerId: string,
                @Request() req: any,
                @Body('rejectionReason') rejectionReason?: string,
            ) {
                Logger.log('Decline Offer route hit');
                return this.realestateOffersService.declineOffer(
                req,
                offerId,
                rejectionReason,
                );
            }

            /***4) Accept and Approve Offer */
            @UseGuards(MerchantAuthGuard)
            @Put('merchant/accept/:offerId')
            async acceptAndApproveOffer(
                @Param('offerId') offerId: string,
                @Request() req: any,
            ) {
                Logger.log('Accept and Approve Offer route hit');
                return this.realestateOffersService.acceptAndApproveOffer(req, offerId);
            }

            /***5) Send Counter Offer */
            @UseGuards(MerchantAuthGuard)
            @Post('merchant/counter/:offerId')
            async sendCounterOffer(
                @Param('offerId') offerId: string,
                @Request() req: any,
                @Body('counterOfferAmount') counterOfferAmount: number,
                @Body('counterOfferMessage') counterOfferMessage?: string,
            ) {
                Logger.log('Send Counter Offer route hit');
                return this.realestateOffersService.sendCounterOffer(
                req,
                offerId,
                counterOfferAmount,
                counterOfferMessage,
                );
            }

            /***6) Revoke Offer Approval */
            @UseGuards(MerchantAuthGuard)
            @Put('merchant/revoke/:offerId')
            async revokeOfferApproval(
                @Param('offerId') offerId: string,
                @Request() req: any,
                @Body('revocationReason') revocationReason?: string,
            ) {
                Logger.log('Revoke Offer Approval route hit');
                return this.realestateOffersService.revokeOfferApproval(
                req,
                offerId,
                revocationReason,
                );
            }; that could serve for other call to actions

On The third tab: Acquisitions:
    This tab should be redesigned in a highly professional view that shows all acquisitions on this particular property, with some chart analytics that shows growth of this property over time. And an Option to  place acquired property bank up for sales when merchants perceive growth of this asset is good for them to sell, this page depicts kind of a stock analysis page. Route for this component : ${baseUrl}/real-estate/acquisitions/@UseGuards(MerchantAuthGuard)
  @Get('merchant/properties')
  async viewAcquisitionsOnMyProperties(
    @Request() req: any,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.acquisitionService.viewAcquisitionsOnMyProperties(
      req,
      limit,
      offset,
    );
  }

  // View Single Acquisition (Merchant)
  @UseGuards(MerchantAuthGuard)
  @Get('merchant/:acquisitionId')
  async viewSingleAcquisitionByMerchant(
    @Request() req: any,
    @Param('acquisitionId') acquisitionId: string,
  ) {
    return this.acquisitionService.viewSingleAcquisitionByMerchant(
      req,
      acquisitionId,
    );
  }

  // Upload Agreement Documents
  @UseGuards(MerchantAuthGuard)
  @Put('merchant/:acquisitionId/agreement-documents')
  async uploadAgreementDocuments(
    @Request() req: any,
    @Param('acquisitionId') acquisitionId: string,
    @Body('documents') documents: any[],
  ) {
    return this.acquisitionService.uploadAgreementDocuments(
      req,
      acquisitionId,
      documents,
    );
  } and the implementations and responses are:  async viewAcquisitionsOnMyProperties(
    merchantId: string,
    limit: number = 10,
    offset: number = 0,
  ) {
    this.logger.log('Fetching merchant acquisitions', {
      merchantId,
      limit,
      offset,
    });

    try {
      const [acquisitions, total] = await Promise.all([
        this.database.propertyAcquisition.findMany({
          where: { merchantId },
          orderBy: { createdAt: 'desc' },
          skip: offset,
          take: limit,
          include: {
            property: {
              select: {
                id: true,
                title: true,
                slug: true,
                image: true,
                price: true,
              },
            },
          },
        }),
        this.database.propertyAcquisition.count({ where: { merchantId } }),
      ]);

      return {
        success: true,
        statusCode: 200,
        acquisitions,
        pagination: {
          total,
          limit,
          offset,
          currentPage: Math.floor(offset / limit) + 1,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error(`Failed to fetch merchant acquisitions: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: 500,
        message: 'Failed to fetch acquisitions',
      });
    }
  }

  // 8) View Single Acquisition (Merchant)
  async viewSingleAcquisitionByMerchant(acquisitionId: string, merchantId: string) {
    this.logger.log('Fetching single acquisition for merchant', {
      acquisitionId,
      merchantId,
    });

    try {
      const acquisition = await this.database.propertyAcquisition.findUnique({
        where: { id: acquisitionId },
        include: {
          property: true,
        },
      });

      if (!acquisition) {
        throw new RpcException({
          statusCode: 404,
          message: 'Acquisition not found',
        });
      }

      if (acquisition.merchantId !== merchantId) {
        throw new RpcException({
          statusCode: 403,
          message: 'Unauthorized to view this acquisition',
        });
      }

      return {
        success: true,
        statusCode: 200,
        acquisition,
      };
    } catch (error) {
      this.logger.error(`Failed to fetch acquisition: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: error?.statusCode || 500,
        message: error?.message || 'Failed to fetch acquisition',
      });
    }
  }

  // 9) Upload Agreement Documents (Merchant)
  async uploadAgreementDocuments(data: UploadAgreementDocumentsDto, merchantId: string) {
    this.logger.log('Uploading agreement documents', {
      acquisitionId: data.acquisitionId,
      merchantId,
    });

    try {
      const acquisition = await this.database.propertyAcquisition.findUnique({
        where: { id: data.acquisitionId },
      });

      if (!acquisition) {
        throw new RpcException({
          statusCode: 404,
          message: 'Acquisition not found',
        });
      }

      if (acquisition.merchantId !== merchantId) {
        throw new RpcException({
          statusCode: 403,
          message: 'Unauthorized to update this acquisition',
        });
      }

      if (acquisition.status !== 'DOCUMENTS_APPROVED' && acquisition.status !== 'AGREEMENT_PENDING') {
        throw new RpcException({
          statusCode: 400,
          message: 'Documents must be approved before uploading agreement',
        });
      }

      const agreementDocs = data.agreementDocuments.map((doc) => ({
        documentName: doc.documentName,
        documentUrl: doc.documentUrl,
        qrCodeUrl: doc.qrCodeUrl,
        uploadedAt: new Date(),
        uploadedBy: merchantId,
      }));

      const updatedAcquisition = await this.database.propertyAcquisition.update({
        where: { id: data.acquisitionId },
        data: {
          propertyAgreementDocuments: agreementDocs,
          status: 'AGREEMENT_UPLOADED',
          agreementUploadedAt: new Date(),
        },
      });

      return {
        success: true,
        statusCode: 200,
        acquisition: updatedAcquisition,
        message: 'Agreement documents uploaded successfully',
      };
    } catch (error) {
      this.logger.error(`Failed to upload agreement documents: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: error?.statusCode || 500,
        message: error?.message || 'Failed to upload agreement documents',
      });
    }
  }. 